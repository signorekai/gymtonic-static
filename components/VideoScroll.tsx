import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { LoaderContext, LoaderContextType } from '../pages/_app';

interface Props {
  totalFrames: number;
  ext?: string;
  path: string;
}

const fitImageOn = (canvas: HTMLCanvasElement, imageObj: HTMLImageElement) => {
  const context = canvas.getContext('2d');
  const imageAspectRatio: number = imageObj.width / imageObj.height;
  const canvasAspectRatio: number = canvas.width / canvas.height;
  let renderableHeight: number;
  let renderableWidth: number;
  let xStart: number;
  let yStart: number;

  // If image's aspect ratio is less than canvas's we fit on height
  // and place the image centrally along width
  if (imageAspectRatio < canvasAspectRatio) {
    renderableWidth = canvas.width;
    renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
    xStart = 0;
    yStart = (canvas.height - renderableHeight) / 2;
  }
  // If image's aspect ratio is greater than canvas's we fit on width
  // and place the image centrally along height
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

const useLoaderContext = (): LoaderContextType => useContext(LoaderContext);

export default function VideoScroller({
  ext = 'jpg',
  totalFrames,
  path,
}: Props): JSX.Element {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setShowLoader } = useLoaderContext();

  useEffect(() => {
    const iFrames: Array<HTMLImageElement> = [];
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x <= totalFrames; x++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const imageObj = document.createElement('img');
      imageObj.setAttribute('src', `${path}/frame-${x}.${ext}`);
      iFrames.push(imageObj);
    }

    void Promise.all(
      iFrames
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

    const handleScroll = () => {
      if (scrollerRef.current) {
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

        if (canvasRef.current) {
          if (iFrames[currentFrame] && iFrames[currentFrame].complete) {
            fitImageOn(canvasRef.current, iFrames[currentFrame]);
          } else if (iFrames[currentFrame]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            iFrames[currentFrame].addEventListener('load', () => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              if (canvasRef.current) {
                fitImageOn(canvasRef.current, iFrames[currentFrame]);
              }
            });
          }
        }
      }
    };
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        handleScroll();
      }
    };

    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="h-[250vh]" ref={scrollerRef}>
      <div className="sticky top-0 l-0 w-full h-screen flex flex-col justify-center items-center border-60 border-red">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </section>
  );
}
