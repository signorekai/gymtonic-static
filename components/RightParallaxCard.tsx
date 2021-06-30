import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

interface TransitionProps {
  previousIndex: number;
  direction: 'up' | 'down';
}

const RightParallaxCard = ({
  className = 'bg-red text-white',
  headerTitle,
  ownIndex,
  parallaxIndex,
  videoSrc,
  videoClassName,
  paragraph,
  link,
  custom,
}: {
  className?: string;
  headerTitle: string;
  ownIndex: number;
  parallaxIndex: number;
  videoSrc: string;
  videoClassName: string;
  paragraph: string;
  link: string;
  custom: TransitionProps;
}): JSX.Element => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(parallaxIndex === ownIndex);
    if (parallaxIndex === ownIndex) {
      console.log(ownIndex);
    }
  }, [ownIndex, parallaxIndex]);

  const createShowVariant = (
    otherProperties: Record<string, unknown>,
    { previousIndex, delay = 0 }: TransitionProps & { delay: number },
  ) => ({
    ...otherProperties,
    transition: {
      type: 'spring',
      delay: Math.abs(previousIndex - parallaxIndex) * 0.3 + delay,
    }
  });

  return (
    <div
      key={ownIndex}
      className={`text-center md:text-lg leading-tight md:leading-tight flex flex-col justify-center items-center w-full h-screen-1/2 lg:h-screen relative ${className}`}>
      <AnimatePresence exitBeforeEnter>
        {show && (
          <>
            <div
              className={`relative flex flex-col justify-center items-center ${videoClassName}`}>
              <motion.h1
                custom={custom}
                variants={{
                  show: (transitionProps) =>
                    createShowVariant(
                      {
                        opacity: 1,
                        y: '-50%',
                      },
                      transitionProps,
                    ),
                  hidden: {
                    opacity: 0,
                    y: '-20%',
                  },
                }}
                className="h1 italic absolute top-1/2 w-screen lg:w-[50vw] text-center z-50">
                {headerTitle}
              </motion.h1>
              <video
                autoPlay
                muted
                loop
                src={videoSrc}
                className="w-auto h-auto max-w-full max-h-full relative z-20">
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
            <motion.p
              custom={custom}
              variants={{
                show: (transitionProps) =>
                  createShowVariant(
                    {
                      opacity: 1,
                      y: 0,
                    },
                    { ...transitionProps, delay: 0.1 },
                  ),
                hidden: { opacity: 0, y: 30 },
              }}
              className="px-4 md:px-0 md:w-2/3 mt-2 md:mt-4 text-sm md:text-lg md:leading-tight font-bold pb-4">
              {paragraph}
            </motion.p>
            <Link href="/">
              <motion.a
                custom={custom}
                variants={{
                  show: (transitionProps) =>
                    createShowVariant(
                      {
                        opacity: 1,
                        x: 0,
                      },
                      { ...transitionProps, delay: 0.2 },
                    ),
                  hidden: { opacity: 0, x: '100%' },
                }}
                className="absolute bottom-4 md:right-8 md:text-right text-xs md:text-base md:leading-tight max-w-3/4 md:max-w-1/2">
                {link}
              </motion.a>
            </Link>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightParallaxCard;
