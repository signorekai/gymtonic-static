import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import withLayout from '../components/Layout';
import AboutCard from '../components/AboutCard';
import MobileAboutHeader from '../components/MobileAboutHeader';
import Carousel, { CarouselCard } from '../components/Carousel';

import Image from 'next/image';

import Coach1 from '../assets/images/Coach-1.png';
import Coach2 from '../assets/images/Coach-2.png';
import Coach3 from '../assets/images/Coach-3.png';
import Coach4 from '../assets/images/Coach-4.png';
import withMobileNav from '../components/MobileNav';
import withLoader from '../components/Loader';
import withSignUpForm from '../components/SignUpForm';

import SignUpBtn from '../components/SignUpButton';
import SignupBtnSrc from '../assets/images/SignUpButtons-6-1.png';
import SignupBtnHoverSrc from '../assets/images/SignUpButtons-6-2.png';
import SignupBtnMobileSrc from '../assets/images/SignUpButtons-Small-6.png';
import { useActiveHeader, useActiveHeaderForElement } from '../lib/hooks';

const Page = ({
  setScrolledHeader,
  setShowLoader,
  setShowSignUpForm,
  setShowHeader,
}) => {
  const panelRef = useRef(null);

  useActiveHeader(setShowHeader);
  useActiveHeaderForElement(setShowHeader, panelRef);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const h4Classes = 'text-lg md:text-2xl leading-none md:leading-tight mt-5';

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
    <main className="flex flex-col lg:flex-row items-start relative min-h-screen page-about">
      <AboutCard hideOnMobile />
      <MobileAboutHeader isSticky />
      <motion.section
        ref={panelRef}
        initial="initial"
        animate="show"
        exit="exit"
        variants={{
          initial: { opacity: 1 },
          exit: { opacity: 1 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="content-container pt-10 md:pt-18 lg:pt-32 justify-between flex-1 lg:h-screen lg:overflow-y-auto lg:no-scrollbar">
        <motion.div
          variants={{
            initial: { y: -20, opacity: 0 },
            show: { y: 0, opacity: 1 },
            exit: { y: -20, opacity: 0 },
          }}
          className="content-container-px">
          <h2 className="page-title">Coaches</h2>
          <h4 className={h4Classes}>
            They are exercise trainers and fitness instructors who are trained
            for this programme.
          </h4>
          <h4 className={h4Classes}>
            While they are professionals, the uncles and aunties at our gyms
            treat them like their own children: Their training sessions are
            filled with encouragement and laughter.
          </h4>
        </motion.div>
        <motion.h5
          variants={{
            initial: { y: -20, opacity: 0 },
            show: { y: 0, opacity: 1 },
            exit: { y: -20, opacity: 0 },
          }}
          className="font-bold uppercase text-xs mt-8 mb-4 text-center">
          What they say
        </motion.h5>
        <Carousel navBtnPosition="top" navBtnStyle={{}}>
          <CarouselCard>
            <div>
              <blockquote className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “One of my clients used to take 6 painkiller pills everyday for
                body aches. Now, she takes just 1.”
              </blockquote>
              <h2 className="font-bold uppercase text-center text-xs mt-3">
                Jason Tan,
                <br />
                Ageility Lab, PulseSync
              </h2>
            </div>
            <div className="w-1/2 h-auto relative text-center mx-auto mt-2 pointer-events-none">
              <Image
                unoptimized={true}
                loading="eager"
                src={Coach1}
                alt="Coach Jason Tan"
                sizes="(min-width: 768px) 360px, 220px"
              />
            </div>
          </CarouselCard>
          <CarouselCard>
            <div>
              <blockquote className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “Many seniors worry about getting injured. That’s why we are
                here to guide them on the correct techniques.”
              </blockquote>
              <h2 className="font-bold uppercase text-center text-xs mt-3">
                Looi Yuan Hui,
                <br />
                Bishan Community Club
              </h2>
            </div>
            <div className="w-1/2 h-auto relative text-center mx-auto mt-2 pointer-events-none">
              <Image
                unoptimized={true}                
                loading="eager"
                src={Coach2}
                alt="Coach Looi Yuan Hui"
                sizes="(min-width: 768px) 360px, 220px"
              />
            </div>
          </CarouselCard>
          <CarouselCard>
            <div>
              <blockquote className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-[28rem]">
                “Improved fitness created new possibilities for many seniors.
                Some picked up a new sport or rekindled the love of a sport they
                played in their younger days, making new friends as a result.”
              </blockquote>
              <h2 className="font-bold uppercase text-center text-xs mt-3">
                Andrew Yeo,
                <br />
                Peacehaven Bedok Arena
              </h2>
            </div>
            <div className="w-1/2 h-auto relative text-center mx-auto mt-2 pointer-events-none">
              <Image
                unoptimized={true}
                loading="eager"
                src={Coach3}
                alt="Coach Andrew Yeo"
                sizes="(min-width: 768px) 360px, 220px"
              />
            </div>
          </CarouselCard>
          <CarouselCard>
            <div>
              <blockquote className="text-center text-sm leading-none md:text-lg md:leading-tight mx-auto max-w-xs md:max-w-sm">
                “Exercise helps reduce challenging behaviours from seniors with
                dementia.”
              </blockquote>
              <h2 className="font-bold uppercase text-center text-xs mt-3">
                Joseph Chan
                <br />
                Bishan Community Club
              </h2>
            </div>
            <div className="w-1/2 h-auto relative text-center mx-auto mt-2 pointer-events-none">
              <Image
                unoptimized={true}
                loading="eager"
                src={Coach4}
                alt="Coach Joseph Chan"
                sizes="(min-width: 768px) 360px, 220px"
              />
            </div>
          </CarouselCard>
        </Carousel>
      </motion.section>
      <div className="fixed bottom-5 right-5 z-40">
        <SignUpBtn
          setShowSignUpForm={setShowSignUpForm}
          src={SignupBtnSrc}
          mobileSrc={SignupBtnMobileSrc}
          hoverSrc={SignupBtnHoverSrc}
        />
      </div>
    </main>
  );
};

export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))));
