import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';

import withLayout, { WithLayoutProps } from 'components/Layout';
import AboutCard from 'components/AboutCard';
import MobileAboutHeader from 'components/MobileAboutHeader';
import Carousel, { CarouselCard } from 'components/Carousel';

import Image from 'next/image';

import { LoaderContext, LoaderContextType } from 'pages/_app';

import Coach1 from 'assets/images/Coach-1.png';
import Coach2 from 'assets/images/Coach-2.png';
import Coach3 from 'assets/images/Coach-3.png';
import Coach4 from 'assets/images/Coach-4.png';
import withMobileNav from 'components/MobileNav';

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
}: WithLayoutProps) => {
  const setShowLoader = useContext<LoaderContextType>(LoaderContext);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const h4Classes = 'text-lg md:text-2xl leading-none md:leading-base mt-5';

  const paraVariants = {
    hide: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  const blockQuoteVariants = {
    hide: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { delay: 0.3 } },
  };

  const coachNameVariants = {
    hide: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { delay: 0.4 } },
  };

  const coachImageVariants = {
    hide: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { delay: 0.5 } },
  };

  return (
    <main className="flex flex-col lg:flex-row items-start relative min-h-screen">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky />
      <section className="order-2 lg:order-1 w-full lg:w-1/2 bg-red text-white relative z-20 lg:sticky top-0 pt-10 md:pt-18 lg:pt-22 flex flex-col justify-end flex-1">
        <div className="px-4 md:px-16 ">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-5xl leading-tight md:leading-none font-black relative z-10">
            Coaches
          </motion.h2>
          <motion.h4
            initial="hide"
            animate="show"
            exit="hide"
            variants={paraVariants}
            className={h4Classes}>
            They’re exercise trainers, physiotherapists and occupational
            therapists and fitness instructors trained overseas.
          </motion.h4>
          <motion.h4
            initial="hide"
            animate="show"
            exit="hide"
            variants={paraVariants}
            className={h4Classes}>
            While they are professionals, the uncles and aunties at our gyms
            treat them like their own children: Their training sessions are
            filled with encouragement and laughter.
          </motion.h4>
        </div>
        <div>
          <motion.h5
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold uppercase text-xs mt-8 mb-4 text-center">
            What they say
          </motion.h5>
          <Carousel>
            <CarouselCard>
              <motion.blockquote
                variants={blockQuoteVariants}
                className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “One of my clients used to take 6 painkiller pills everyday for
                body aches. Now, she takes just 1.”
              </motion.blockquote>
              <motion.h2
                variants={coachNameVariants}
                className="font-bold uppercase text-center text-xs mt-3">
                Jason Tan,
                <br />
                Care corner at Woodsquare
              </motion.h2>
              <motion.div
                variants={coachImageVariants}
                className="w-1/2 h-auto relative text-center mx-auto mt-2">
                <Image
                  loading="eager"
                  src={Coach1}
                  alt="Coach Jason Tan"
                  sizes="(min-width: 768px) 360px, 220px"
                />
              </motion.div>
            </CarouselCard>
            <CarouselCard>
              <motion.blockquote
                variants={blockQuoteVariants}
                className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “Many seniors worry about getting injured. That’s why we are
                here to guide them on the correct techniques.”
              </motion.blockquote>
              <motion.h2
                variants={coachNameVariants}
                className="font-bold uppercase text-center text-xs mt-3">
                Looi Yuan Hui,
                <br />
                Bishan Community Clubb
              </motion.h2>
              <motion.div
                variants={coachImageVariants}
                className="w-1/2 h-auto relative text-center mx-auto mt-2">
                <Image
                  loading="eager"
                  src={Coach2}
                  alt="Coach Looi Yuan Hui"
                  sizes="(min-width: 768px) 360px, 220px"
                />
              </motion.div>
            </CarouselCard>
            <CarouselCard>
              <motion.blockquote
                variants={blockQuoteVariants}
                className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “Improved fitness created new possibilities for many seniors.
                Some picked up a new sport or rekindled the love of a sport they
                in their younger days, making new friends as a result.”
              </motion.blockquote>
              <motion.h2
                variants={coachNameVariants}
                className="font-bold uppercase text-center text-xs mt-3">
                Andrew Yeo,
                <br />
                Peacehaven Bedok Arena
              </motion.h2>
              <motion.div
                variants={coachImageVariants}
                className="w-1/2 h-auto relative text-center mx-auto mt-2">
                <Image
                  loading="eager"
                  src={Coach3}
                  alt="Coach Andrew Yeo"
                  sizes="(min-width: 768px) 360px, 220px"
                />
              </motion.div>
            </CarouselCard>
            <CarouselCard>
              <motion.blockquote
                variants={blockQuoteVariants}
                className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “Exercise helps reduce challenging behaviours from seniors with
                dementia.”
              </motion.blockquote>
              <motion.h2
                variants={coachNameVariants}
                className="font-bold uppercase text-center text-xs mt-3">
                Joseph Chan
                <br />
                Bishan Community Club
              </motion.h2>
              <motion.div
                variants={coachImageVariants}
                className="w-1/2 h-auto relative text-center mx-auto mt-2">
                <Image
                  loading="eager"
                  src={Coach4}
                  alt="Coach Joseph Chan"
                  sizes="(min-width: 768px) 360px, 220px"
                />
              </motion.div>
            </CarouselCard>
          </Carousel>
        </div>
      </section>
    </main>
  );
};

export default withMobileNav(withLayout(Page));
