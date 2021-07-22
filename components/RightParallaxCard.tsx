import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import LeftArrow from 'assets/images/left-arrow.png';

const RightParallaxCard = ({
  className = 'bg-red text-white',
  headerTitle,
  videoSrc,
  videoClassName,
  paragraph,
  link,
  href,
  videoPoster,
}: {
  className?: string;
  headerTitle: string;
  videoSrc: string;
  videoClassName: string;
  paragraph: string;
  link: string;
  href: string;
  videoPoster: string;
}): JSX.Element => {
  const [show, setShow] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.intersectionRatio > 0.7) {
            setShow(true);
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        },
      );

      observer.observe(card.current);
      const thisCard = card.current;
      return () => {
        observer.unobserve(thisCard);
      };
    }
    return () => {};
  }, [card]);

  return (
    <div
      ref={card}
      className={`text-center md:text-lg leading-tight md:leading-tight flex flex-col justify-center items-center w-full h-[50vh] lg:h-screen relative snap-child ${className}`}>
      <AnimatePresence exitBeforeEnter>
        {show && (
          <>
            <div
              className={`relative flex flex-col justify-center items-center ${videoClassName}`}>
              <motion.h1
                variants={{
                  animate: {
                    opacity: 1,
                    y: '-50%',
                  },
                  exit: {
                    opacity: 0,
                    y: '-20%',
                  },
                  initial: {
                    opacity: 1,
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
                poster={videoPoster}
                src={videoSrc}
                className="w-auto h-auto max-w-full max-h-full relative z-20">
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
            <motion.p
              variants={{
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.1,
                  },
                },
                initial: { opacity: 0, y: 30 },
                exit: { opacity: 0, y: 30 },
              }}
              className="px-4 md:px-0 md:w-7/12 mt-2 md:mt-4 text-sm md:text-lg md:leading-tight font-bold pb-4">
              {paragraph}
            </motion.p>
            <div className="absolute flex flex-row items-start bottom-7 md:right-8 max-w-3/4 md:max-w-1/2 -translate-x-2 md:translate-x-0 md:text-right">
              <Link href={href} scroll={false} passHref>
                <motion.a
                  variants={{
                    animate: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.2,
                        when: 'beforeChildren',
                        duration: 0.7,
                      },
                    },
                    initial: { opacity: 0, x: '40%' },
                    exit: { opacity: 0, x: '40%' },
                  }}
                  className="text-xs md:text-base leading-none group hover:cursor-pointer hover:mr-[-1px]">
                  <motion.div
                    variants={{
                      animate: {
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0, duration: 0.2 },
                      },
                      initial: { opacity: 0, x: '-100%' },
                      exit: { opacity: 0, x: '-100%' },
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
