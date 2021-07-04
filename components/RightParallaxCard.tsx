import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import LeftArrow from 'assets/images/left-arrow.png';

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
  href,
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
  href: string;
  custom: TransitionProps;
}): JSX.Element => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(parallaxIndex === ownIndex);
  }, [ownIndex, parallaxIndex]);

  const createShowVariant = (
    otherProperties: Record<string, unknown>,
    {
      previousIndex,
      delay = 0,
      overWriteTransition = {},
    }: TransitionProps & { delay: number; overWriteTransition?: Transition },
  ) => ({
    ...otherProperties,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    transition: {
      type: 'spring',
      delay: Math.abs(previousIndex - parallaxIndex) * 0.3 + delay,
      ...overWriteTransition,
    },
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
                disablePictureInPicture
                controlsList="nodownload"
                playsInline
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
              className="px-4 md:px-0 md:w-7/12 mt-2 md:mt-4 text-sm md:text-lg md:leading-tight font-bold pb-4">
              {paragraph}
            </motion.p>
            <div className="absolute flex flex-row items-start bottom-7 md:right-8 max-w-3/4 md:max-w-1/2 -translate-x-2 md:translate-x-0 md:text-right">
              <Link href={href} scroll={false} passHref>
                <motion.a
                  custom={custom}
                  variants={{
                    show: (transitionProps) =>
                      createShowVariant(
                        {
                          opacity: 1,
                          x: 0,
                        },
                        {
                          ...transitionProps,
                          delay: 0.2,
                          overWriteTransition: {
                            when: 'beforeChildren',
                            duration: 0.7,
                          },
                        },
                      ),
                    hidden: { opacity: 0, x: '40%' },
                  }}
                  className="text-xs md:text-base leading-none group hover:cursor-pointer hover:mr-[-1px]">
                  <motion.div
                    custom={custom}
                    variants={{
                      show: (transitionProps) =>
                        createShowVariant(
                          {
                            opacity: 1,
                            x: 0,
                          },
                          {
                            ...transitionProps,
                            overWriteTransition: { delay: 0, duration: 0.2 },
                          },
                        ),
                      hidden: { opacity: 0, x: '-100%' },
                      hover: { x: '-0.5rem' },
                    }}
                    className="mx-2 w-4 inline-block align-middle group-hover:!-translate-x-2 duration-100">
                    <Image src={LeftArrow} width={8} height={14} />
                  </motion.div>
                  {link}
                </motion.a>
              </Link>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightParallaxCard;
