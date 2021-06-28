import { motion, AnimatePresence } from 'framer-motion';
import { LoaderContext, LoaderContextType } from 'pages/_app';
import React, { RefObject, useContext, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

// import { LoaderContext, LoaderContextType } from '../pages/_app';

import DownArrow from '../assets/images/downarrow.svg';

interface Props {
  totalFrames: number;
  ext?: string;
  path: string;
  children?: JSX.Element;
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-return

export default function VideoScroller({
  ext = 'jpg',
  totalFrames,
  path,
  setHeaderRef,
  children,
}: Props): JSX.Element {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { setShowLoader }: LoaderContextType = useContext(LoaderContext);
  const refCurrentFrame = useRef(0);
  const [ showReminder, setShowReminder ] = useState(true);

  const borderWidth = window.innerWidth >= 768 ? 60 : 10;

  useEffect(() => {
    const videoFrames: Array<HTMLImageElement> = [];
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x <= totalFrames; x++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const imageObj = document.createElement('img');
      imageObj.setAttribute('src', `${path}/frame-${x}.${ext}`);
      videoFrames.push(imageObj);
    }
    if (canvasRef.current) fitImageOn(canvasRef.current, videoFrames[0]);

    console.log('checking length of unloaded frames');
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
        console.log('frames all loaded');

        setShowLoader(false);
      });
    } else {
      console.log('length of unloaded frames = 0');
    }

    const handleScroll = () => {
      console.log('handling scroll and rendering');

      if (scrollerRef.current) {
        console.log('scrollerRef exists');

        if (window.pageYOffset > 1) {
          setShowReminder(false);
        }

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

        refCurrentFrame.current = currentFrame;

        if (canvasRef.current) {
          console.log('rendering to canvasRef');
          if (videoFrames[currentFrame] && videoFrames[currentFrame].complete) {
            fitImageOn(canvasRef.current, videoFrames[currentFrame]);
          } else if (videoFrames[currentFrame]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            videoFrames[currentFrame].addEventListener('load', () => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              if (canvasRef.current) {
                fitImageOn(canvasRef.current, videoFrames[currentFrame]);
              }
            });
          }
        }
      }
    };

    const handleResize = () => {
      if (
        canvasRef.current &&
        (canvasRef.current.width !== window.innerWidth - borderWidth * 2 ||
          canvasRef.current.height !== window.innerHeight - borderWidth * 2)
      ) {
        canvasRef.current.width =
          (window.innerWidth - borderWidth * 2) * window.devicePixelRatio;
        canvasRef.current.height =
          (window.innerHeight - borderWidth * 2) * window.devicePixelRatio;
      }
      handleScroll();
    };

    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ext, path, totalFrames]);

  useEffect(() => {
    if (scrollerRef) {
      setHeaderRef(scrollerRef);
    }
  }, [scrollerRef, setHeaderRef]);

  return (
    <section className="h-[250vh]" ref={scrollerRef}>
      <div
        ref={canvasContainerRef}
        className="sticky border-box bg-pink overflow-hidden top-0 l-0 w-full h-screen flex flex-col justify-items-start md:justify-center items-center pt-24 md:pt-0 border-10 md:border-60 border-red">
        {children}
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
              className="xl:hidden text-sm absolute z-40 bottom-0 p-3 text-white">
              <motion.div
                className="w-full flex flex-col items-center"
                initial={{ translateY: 0 }}
                animate={{ translateY: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                }}>
                Scroll
                <img src="images/down-arrow.svg" alt="" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <canvas
          ref={canvasRef}
          width={window.innerWidth - borderWidth * 2}
          height={window.innerHeight - borderWidth * 2}
          className="w-full h-full absolute top-0 left-0 z-30"
        />
        <img
          className="object-cover w-full h-full origin-center absolute z-20"
          src={`${path}/frame-0.${ext}`}
          alt=""
        />
      </div>
    </section>
  );
}
