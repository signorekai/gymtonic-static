import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fitImageOn = (canvas, imageObj) => {
  const context = canvas.getContext('2d');
  const imageAspectRatio = imageObj.width / imageObj.height;
  const canvasAspectRatio = canvas.width / canvas.height;
  let renderableHeight;
  let renderableWidth;
  let xStart;
  let yStart;

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

const tryToFitImageOn = (actualCurrentFrame, canvasRef) => {
  if (canvasRef.current) {
    if (actualCurrentFrame && actualCurrentFrame.complete) {
      fitImageOn(canvasRef.current, actualCurrentFrame);
    } else if (actualCurrentFrame) {
      actualCurrentFrame.addEventListener('load', () => {
        if (canvasRef.current) {
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
}) {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const videoScrollerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(true);

  const canvasAnimateControls = useAnimation();

  const breakpoint = 1024;
  const borderWidth = window.innerWidth >= 768 ? 60 : 10;

  const { ref, inView, entry } = useInView({
    threshold: [0.1, 0.2, 0.3, 0.4],
  });

  useEffect(() => {
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
    const videoFrames = [];

    if (window.innerWidth >= 1024) {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x <= totalFrames; x++) {
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
