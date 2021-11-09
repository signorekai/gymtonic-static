import React, { RefObject, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { WithLoaderProps } from 'components/Loader';

interface Props {
  height: number;
  totalFrames: number;
  ext?: 'jpg' | 'jpeg' | 'gif' | 'png' | 'JPG' | 'JPEG' | 'GIF' | 'PNG';
  path: string;
  children?: JSX.Element;
  videoPath: string;
  onEnter?(): void;
  onExit?(): void;
  container: React.RefObject<HTMLDivElement>;
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
  children,
  setShowLoader,
  videoPath,
  container,
  height,
  onEnter = () => {},
  onExit = () => {},
}: Props & WithLoaderProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const videoScrollerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  const canvasAnimateControls = useAnimation();

  const breakpoint = 1024;
  const borderWidth = window.innerWidth >= 768 ? 60 : 10;

  const { ref, inView, entry } = useInView({
    threshold: [0.1, 0.2, 0.3, 0.4],
  });

  useEffect(() => {
    console.log('in view', entry?.intersectionRatio, entry?.isIntersecting);
    if (inView && entry?.isIntersecting && entry.intersectionRatio > 0.3) {
      onEnter();
    } else if (
      entry?.isIntersecting === false &&
      entry.intersectionRatio < 0.1
    ) {
      onExit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.intersectionRatio, inView]);

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

    //   const handleScroll = () => {
    //     if (isMobile) return;
    //     if (container && container.current) {
    //       if (container.current.offsetTop > 1) {
    //         setShowReminder(false);
    //       }
    //       if (
    //         container.current.clientWidth >= breakpoint &&
    //         scrollerRef.current
    //       ) {
    //         // @todo eventually use framer-motion 's useElementScroll
    //         // console.log('desktop');
    //         intervalAnimationRef.current = false;
    //         // desktop
    //         const maxAmount =
    //           scrollerRef.current?.scrollHeight -
    //           document.documentElement.clientHeight * 1.1;

    //         const currentAmount =
    //           window.pageYOffset - scrollerRef.current?.offsetTop;
    //         const scrollPercentage = currentAmount / maxAmount;
    //         const currentFrame =
    //           currentAmount < maxAmount
    //             ? Math.round(scrollPercentage * totalFrames)
    //             : totalFrames;

    //         currentFrameRef.current = currentFrame;
    //         tryToFitImageOn(videoFrames[currentFrame], canvasRef);
    //       }
    //     }
    //   };

    const handleScroll = () => {
      if (container.current) {
        const scrollYProgress =
          container.current.scrollTop /
          container.current.scrollHeight /
          (height / (height + 7));

        const rawFrame = Math.round(
          (scrollYProgress * totalFrames) / (1 / height),
        );

        let currentFrame =
          rawFrame > totalFrames ? rawFrame % totalFrames : rawFrame;

        if (rawFrame > totalFrames * (height - 1)) {
          currentFrame = totalFrames;
        }

        if (isMobile === false) {
          tryToFitImageOn(videoFrames[currentFrame], canvasRef);
        }
      }
    };

    if (container.current) {
      container.current.addEventListener('scroll', handleScroll);
    }
    handleScroll();

    const handleResize = () => {
      console.log('handling resize');
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
    handleResize();
    window.addEventListener('resize', handleResize);

    const currentContainer = container.current;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [
    isMobile,
    borderWidth,
    canvasAnimateControls,
    container,
    ext,
    height,
    path,
    setShowLoader,
    totalFrames,
  ]);

  return (
    <div
      ref={videoScrollerRef}
      className="w-full relative"
      style={{
        height: `calc(var(--vh) * ${isMobile ? 100 : height * 100})`,
      }}>
      <div ref={ref} className="w-full sticky top-0 left-0">
        <div
          ref={canvasContainerRef}
          className={`${
            isMobile ? '' : 'sticky'
          } border-box bg-pink overflow-hidden top-0 w-full h-screen flex flex-col justify-center items-center md:pt-0 border-10 md:border-60 border-red relative`}>
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
                dragConstraints={videoScrollerRef}
                dragMomentum={false}
                dragElastic={0}
                disablePictureInPicture
                controlsList="nodownload"
                playsInline
                autoPlay
                muted
                loop
                className="object-cover object-center w-screen-home-video h-screen max-w-none"
                src={videoPath}>
                <source src={videoPath} type="video/mp4" />
              </motion.video>
            </motion.div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
