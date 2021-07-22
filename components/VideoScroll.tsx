import React, { RefObject, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { WithLoaderProps } from './Loader';

interface Props {
  totalFrames: number;
  videoDuration: number;
  ext?: 'jpg' | 'jpeg' | 'gif' | 'png' | 'JPG' | 'JPEG' | 'GIF' | 'PNG';
  path: string;
  children?: JSX.Element;
  videoPath: string;
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
}

const fitImageOn = (canvas: HTMLCanvasElement, imageObj: HTMLImageElement) => {
  const context = canvas.getContext('2d');
  const imageAspectRatio: number = imageObj.width / imageObj.height;
  const canvasAspectRatio: number = canvas.width / canvas.height;
  let renderableHeight: number;
  let renderableWidth: number;
  let xStart: number;
  let yStart: number;

  // If image's aspect ratio is less than canvas's we fit on width
  // and place the image centrally along height
  if (imageAspectRatio < canvasAspectRatio) {
    renderableWidth = canvas.width;
    renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
    xStart = 0;
    yStart = (canvas.height - renderableHeight) / 2;
  }
  // If image's aspect ratio is greater than canvas's we fit on height
  // and place the image centrally along width
  else if (imageAspectRatio > canvasAspectRatio) {
    renderableHeight = canvas.height;
    renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
    xStart = (canvas.width - renderableWidth) / 2;
    yStart = 0;
  }

  // Happy path - keep aspect ratio
  else {
    renderableHeight = canvas.height;
    renderableWidth = canvas.width;
    xStart = 0;
    yStart = 0;
  }

  context?.drawImage(
    imageObj,
    xStart,
    yStart,
    renderableWidth,
    renderableHeight,
  );
};

const tryToFitImageOn = (
  actualCurrentFrame: HTMLImageElement,
  canvasRef: RefObject<HTMLCanvasElement>,
) => {
  if (canvasRef.current) {
    if (actualCurrentFrame && actualCurrentFrame.complete) {
      // console.log(`rendering frame to canvasRef`);
      fitImageOn(canvasRef.current, actualCurrentFrame);
    } else if (actualCurrentFrame) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      actualCurrentFrame.addEventListener('load', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (canvasRef.current) {
          // console.log(`[onload] rendering frame to canvasRef`);
          fitImageOn(canvasRef.current, actualCurrentFrame);
        }
      });
    }
  }
};

export default function VideoScroller({
  ext = 'jpg',
  totalFrames,
  path,
  setHeaderRef,
  children,
  videoDuration,
  setShowLoader,
  videoPath,
}: Props & WithLoaderProps): JSX.Element {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(0);
  const frame0Ref = useRef<HTMLImageElement>(null);
  const intervalAnimationRef = useRef<boolean>(false);
  const [isMobile, setIsMobile] = useState(true);

  const isIntersecting = useRef(true);

  const [showReminder, setShowReminder] = useState(true);

  const canvasAnimateControls = useAnimation();

  const breakpoint = 1024;
  const borderWidth = window.innerWidth >= 768 ? 60 : 10;

  useEffect(() => {
    const videoFrames: Array<HTMLImageElement> = [];

    if (window.innerWidth >= 1024) {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x <= totalFrames; x++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const imageObj = document.createElement('img');
        imageObj.setAttribute('src', `${path}/frame-${x}.${ext}`);
        videoFrames.push(imageObj);
      }
      if (canvasRef.current) fitImageOn(canvasRef.current, videoFrames[0]);

      if (videoFrames.filter((img) => !img.complete).length > 0) {
        void Promise.all(
          videoFrames
            .filter((img) => !img.complete)
            .map(
              (img) =>
                new Promise((resolve) => {
                  // eslint-disable-next-line no-param-reassign,no-multi-assign
                  img.addEventListener('load', resolve);
                  img.addEventListener('error', resolve);
                }),
            ),
        ).then(() => {
          setShowLoader(false);
        });
      } else {
        setShowLoader(false);
      }
    } else {
      setShowLoader(false);
    }

    const handleScroll = () => {
      if (window.pageYOffset > 1) {
        setShowReminder(false);
      }

      if (isMobile) return;

      if (window.innerWidth >= breakpoint && scrollerRef.current) {
        // @todo eventually use framer-motion 's useElementScroll
        // console.log('desktop');

        intervalAnimationRef.current = false;
        // desktop
        const maxAmount =
          scrollerRef.current?.scrollHeight -
          document.documentElement.clientHeight * 1.1;
        const currentAmount =
          window.pageYOffset - scrollerRef.current?.offsetTop;
        const scrollPercentage = currentAmount / maxAmount;
        const currentFrame =
          currentAmount < maxAmount
            ? Math.round(scrollPercentage * totalFrames)
            : totalFrames;

        currentFrameRef.current = currentFrame;
        tryToFitImageOn(videoFrames[currentFrame], canvasRef);
      }
    };

    const handleResize = () => {
      // console.log('handling resize');
      const canvasWidth =
        (window.innerWidth - borderWidth * 2) * window.devicePixelRatio;

      if (window.innerWidth < breakpoint) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      if (
        canvasRef.current &&
        (canvasRef.current.width !== canvasWidth ||
          canvasRef.current.height !== window.innerHeight - borderWidth * 2)
      ) {
        canvasRef.current.height =
          (window.innerHeight - borderWidth * 2) * window.devicePixelRatio;
        canvasRef.current.width = canvasWidth;

        void canvasAnimateControls.start({
          x:
            window.innerWidth < breakpoint
              ? (window.innerWidth -
                  borderWidth * 2 -
                  canvasWidth / window.devicePixelRatio) /
                2
              : 0,
          transition: {
            duration: 0,
          },
        });
      }
      handleScroll();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting.current = entry.isIntersecting;
      },
      {
        root: null,
        threshold: [0, 0.5, 1],
      },
    );

    if (canvasRef.current) observer.observe(canvasRef.current);

    handleResize();
    const canvas = canvasRef.current;

    if (window.innerWidth >= breakpoint) {
      window.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      if (canvas) observer.unobserve(canvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    borderWidth,
    ext,
    path,
    setShowLoader,
    totalFrames,
    frame0Ref,
    canvasAnimateControls,
    videoDuration,
    canvasRef,
    isMobile,
  ]);

  useEffect(() => {
    if (scrollerRef) {
      setHeaderRef(scrollerRef);
    }
  }, [scrollerRef, setHeaderRef]);

  return (
    <section
      className={
        window.innerWidth < breakpoint
          ? 'h-screen relative z-20 snap-child'
          : 'h-[250vh] relative z-20 snap-child'
      }
      ref={scrollerRef}>
      <div
        ref={canvasContainerRef}
        className={`${
          isMobile ? '' : 'sticky'
        } border-box bg-pink overflow-hidden top-0 w-full h-[100vh] flex flex-col justify-items-start md:justify-center items-center md:pt-0 border-10 md:border-60 border-red`}>
        <AnimatePresence>
          {showReminder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, translateY: 30 }}
              transition={{
                duration: 0.4,
                ease: [0.175, 0.85, 0.42, 0.96],
                when: 'beforeChildren',
              }}
              className="xl:hidden text-sm absolute z-30 bottom-0 p-3 text-white">
              <motion.div
                className="w-full flex flex-col items-center"
                initial={{ translateY: 0 }}
                animate={{ translateY: [0, -5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                }}>
                Scroll
                <img src="images/down-arrow.svg" alt="" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isMobile && (
          <motion.canvas
            animate={canvasAnimateControls}
            ref={canvasRef}
            width={window.innerWidth - borderWidth * 2}
            height={window.innerHeight - borderWidth * 2}
            className="h-full absolute top-0 left-0 z-30"
          />
        )}
        {isMobile && (
          <motion.div className="w-screen-home-video h-screen relative">
            <motion.video
              animate={canvasAnimateControls}
              drag="x"
              dragConstraints={scrollerRef}
              dragMomentum={false}
              dragElastic={0}
              disablePictureInPicture
              controlsList="nodownload"
              playsInline
              autoPlay
              muted
              loop
              className="object-cover object-center w-screen-home-video h-full max-w-none"
              src={videoPath}>
              <source src={videoPath} type="video/mp4" />
            </motion.video>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
