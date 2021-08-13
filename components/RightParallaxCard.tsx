import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import LeftArrow from 'assets/images/left-arrow.png';
import { useInView } from 'react-intersection-observer';

const RightParallaxCard = ({
  className = 'bg-red text-white',
  headerTitle,
  videoSrc,
  videoClassName,
  paragraph,
  link,
  href,
  videoPoster,
  onEnter = () => {},
  container,
}: {
  container: React.RefObject<HTMLDivElement>;
  className?: string;
  headerTitle: string;
  videoSrc: string;
  videoClassName: string;
  paragraph: string;
  link: string;
  href: string;
  videoPoster: string;
  onEnter?(): void;
}): JSX.Element => {
  const [show, setShow] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.95,
  });

  console.log(38, 'render', link);

  useEffect(() => {
    if (inView) {
      onEnter();
      setShow(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, inView, link]);

  return (
    <div
      ref={ref}
      className={`h-screen pt-screen-1/2 lg:pt-0 w-full text-white bg-red text-center md:text-lg leading-tight md:leading-tight flex flex-col justify-center items-center relative ${className}`}>
      <AnimatePresence exitBeforeEnter>
        {show && (
          <>
            <div
              className={`relative flex flex-col justify-center items-center ${videoClassName}`}>
              <motion.h1
                variants={{
                  show: {
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
                className="h1 italic absolute top-1/2 w-screen lg:w-[50vw] text-center z-10">
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
                className="w-auto h-auto max-w-full max-h-full relative z-0">
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
            <motion.p
              variants={{
                show: {
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
            <div className="absolute flex flex-row items-start bottom-7 left-0 w-full">
              <Link href={href} scroll={false} passHref>
                <motion.a
                  variants={{
                    show: {
                      opacity: 1,
                      y: 0,
                      x: 0,
                      transition: {
                        delay: 0.2,
                        when: 'beforeChildren',
                        duration: 0.2,
                      },
                    },
                    initial: { opacity: 0, x: 0, y: -20 },
                    exit: { opacity: 0, x: 0, y: -20 },
                  }}
                  className="text-xs md:text-base leading-none group hover:cursor-pointer max-w-2/3 md:max-w-sm block mx-auto md:mr-8">
                  <motion.div
                    variants={{
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0, duration: 0.2 },
                      },
                      initial: { opacity: 0, x: 0 },
                      exit: { opacity: 0, x: 0 },
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
