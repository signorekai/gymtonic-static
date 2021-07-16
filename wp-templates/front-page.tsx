/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import { getApolloClient, getPosts } from '@wpengine/headless';
import { AnimatePresence, motion } from 'framer-motion';

import withMobileNav from 'components/MobileNav';
import withLoader, { WithLoaderProps } from 'components/Loader';
import VideoScroll from 'components/VideoScroll';
import withLayout from 'components/Layout';
import RightParallaxCard from 'components/RightParallaxCard';
import MobileNavBtn from 'components/MobileNavBtn';
import { useScroll } from 'lib/hooks';

import Gym1 from 'assets/images/gym1.jpg';
import Gym2 from 'assets/images/gym2.jpg';
import Gym3 from 'assets/images/gym3.jpg';
import Gym4 from 'assets/images/gym4.jpg';
import Gym5 from 'assets/images/gym5.jpg';
import Gym6 from 'assets/images/gym6.jpg';

import SignUpBtn from 'components/SignUpButton';
import SignupBtnSrc from 'assets/images/SignUpButtons-1-1.png';
import SignupBtnHoverSrc from 'assets/images/SignUpButtons-1-2.png';
import SignupBtnMobileSrc from 'assets/images/SignUpButtons-Small-1.png';

const breakpoint = 1024;

/**
 * Example of post variables to query the first six posts in a named category.
 * @see https://github.com/wpengine/headless-framework/tree/canary/docs/queries
 */
const firstSixInCategory = {
  variables: {
    first: 6,
    where: { categoryName: 'uncategorized' }, // Omit this to get posts from all categories.
  },
};

const LeftCard = ({ src }: { src: StaticImageData }) => (
  <div className="bg-white flex-1 w-full h-screen-1/2 lg:h-screen relative">
    <Image
      src={src}
      alt=""
      layout="fill"
      sizes="(min-width: 1920px) 960px, (min-width: 1366px) 750px, (min-width: 1024px) 600px, 400px"
      quality="100"
      objectFit="cover"
      priority
      placeholder="blur"
    />
  </div>
);

const Page: React.FunctionComponent<any> = ({
  setHeaderRef,
  setShowMobileNav,
  setShowLoader,
}: WithMobileNavProps & WithLayoutProps & WithLoaderProps) => {
  const container = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const leftViewport = useRef<HTMLDivElement>(null);
  const rightViewport = useRef<HTMLDivElement>(null);
  const scrollValues = useScroll(container);

  const positions = useRef({ left: 0, right: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoint && rightViewport.current) {
        rightViewport.current.style.transform = `translate3d(0, 0, 0)`;
      }
    };

    const handleScroll = () => {
      let newLeftPosition = 0;
      let newRightPosition = 0;
      let isTicking = false;

      if (leftViewport.current && rightViewport.current) {
        const leftValue =
          scrollValues.scrollYProgress +
          1 / leftViewport.current.children.length;

        newLeftPosition = Math.min(
          Math.max(1 - leftValue, 0),
          1 - 1 / leftViewport.current.children.length,
        );

        newRightPosition = Math.min(
          Math.max(scrollValues.scrollYProgress, 0),
          1 - 1 / leftViewport.current.children.length,
        );

        if (
          newLeftPosition !== positions.current.left &&
          newRightPosition !== positions.current.right
        ) {
          leftViewport.current.style.transform = `translate3d(0, ${
            newLeftPosition * -100
          }%, 0)`;
          rightViewport.current.style.transform = `translate3d(0, ${
            newRightPosition * -100
          }%, 0)`;

          positions.current.left = newLeftPosition;
          positions.current.right = newRightPosition;

          if (isTicking === false) {
            requestAnimationFrame(() => {
              handleScroll();
              isTicking = false;
            });
          }
          isTicking = true;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollValues.scrollYProgress]);

  return (
    <>
      <div className="absolute top-6 right-6 text-white md:text-red md:top-20 md:right-20 z-40">
        <MobileNavBtn
          setShowMobileNav={setShowMobileNav}
          barStyle="text-white md:text-red"
        />
      </div>
      <VideoScroll
        setShowLoader={setShowLoader}
        totalFrames={69}
        videoDuration={3}
        videoPath="/videos/home.mp4"
        path="/images/home-video-frames"
        setHeaderRef={setHeaderRef}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.175, 0.85, 0.42, 0.96] }}
            className="absolute top-1/3 -translate-y-1/2 z-30 text-center text-red mx-8 pointer-events-none">
            <h1 className="h1 text-red">Gym Tonic</h1>
            <h4 className="text-2xl md:text-3xl font-black leading-none">
              Exercise as Medicine
            </h4>
          </motion.div>
        </AnimatePresence>
      </VideoScroll>
      <section
        ref={container}
        className="w-full h-[300vh] lg:h-screen-6 relative z-20 mb-screen">
        <div
          ref={viewport}
          className="sticky top-0 left-0 w-full h-[100vh] flex flex-col lg:flex-row">
          <div className="lg:flex-1 relative z-40 h-[50vh] lg:h-screen overflow-hidden bg-red">
            <motion.div
              id="left"
              ref={leftViewport}
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col-reverse w-full h-screen-3 lg:h-screen-6 absolute">
              <LeftCard src={Gym1} />
              <LeftCard src={Gym2} />
              <LeftCard src={Gym3} />
              <LeftCard src={Gym4} />
              <LeftCard src={Gym5} />
              <LeftCard src={Gym6} />
            </motion.div>
            <h1 className="h1 absolute w-full top-1/2 -translate-y-1/2 z-30 text-red text-center">
              Gym
            </h1>
          </div>
          <div className="lg:flex-1 h-[50vh] lg:h-screen bottom-0 z-30 overflow-hidden bg-red">
            <motion.div
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              id="right"
              ref={rightViewport}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col w-full h-[300vh] lg:h-screen-6 relative">
              <RightParallaxCard
                headerTitle="Ka-Ching!"
                videoSrc="/videos/Thematic-2-KaChing.mp4"
                videoClassName="max-h-1/2 lg:max-h-none lg:max-w-2/5"
                paragraph="Hospital visits. Medication. Wheelchairs and domestic helpers. We know retiring is expensive. Here’s a cheaper way."
                href="/about"
                link="What is Gym Tonic?"
              />
              <RightParallaxCard
                videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/4"
                videoSrc="/videos/Thematic-3-Kakis.mp4"
                headerTitle="Kakis"
                paragraph="Help Pa and Ma make new friends."
                href="/locations"
                link="Find a gym near you"
              />
              <RightParallaxCard
                videoClassName="max-h-1/2 lg:max-h-none lg:max-w-2/5"
                videoSrc="/videos/Thematic-4-Boleh.mp4"
                headerTitle="Boleh"
                paragraph="To continue doing the things you love, you have to stay physically strong."
                href="/research"
                link="Why Strength Training matters even more when you are old."
              />
              <RightParallaxCard
                videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
                videoSrc="/videos/Thematic-5-Huat.mp4"
                headerTitle="Huat!"
                paragraph="4,000 seniors at 26 eldercare facilities have become stronger. See how they did it."
                href="/stories"
                link="Read their stories"
              />
              <RightParallaxCard
                videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/5"
                videoSrc="/videos/Thematic-6-Kilat.mp4"
                headerTitle="Kilat!"
                paragraph="State-of-the-art pneumatic and hydraulic equipment from Germany and Finland."
                href="/technology"
                link="Understand the process"
              />
              <RightParallaxCard
                videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
                videoSrc="/videos/Thematic-7-Pro.mp4"
                headerTitle="Pro"
                paragraph="Exercise trainers who will guide you every step of the way."
                href="/coaches"
                link="Meet the professionals"
              />
            </motion.div>
          </div>
        </div>
      </section>
      <section className="fixed top-0 w-full h-screen border-red border-10 md:border-60 z-10 flex flex-col justify-center items-center">
        <h1 className="text-7xl md:text-9xl lg:text-11xl word-spacing-0 md:word-spacing-8 font-black leading-none mb-2 lg:mb-0 text-red italic relative z-10 mt-screen-2/10 text-center">
          Mai tu liao!
        </h1>
        <h4 className="h4 text-red relative z-10 text-center max-w-5/6 md:max-w-2/3">
          Don&apos;t delay! Limited slots available.
        </h4>
        <video
          disablePictureInPicture
          controlsList="nodownload"
          playsInline
          autoPlay
          muted
          loop
          className="w-full h-full absolute top-0 left-0 z-0 object-cover object-center"
          src={
            window.innerWidth >= 1366
              ? '/videos/Thematic-8-MaiTuLiao-H.mp4'
              : '/videos/Thematic-9-MaiTuLiao-V.mp4'
          }>
          <source
            src={
              window.innerWidth >= 1366
                ? '/videos/Thematic-8-MaiTuLiao-H.mp4'
                : '/videos/Thematic-9-MaiTuLiao-V.mp4'
            }
            type="video/mp4"
          />
        </video>
      </section>
      <div className="fixed bottom-5 right-5 z-40">
        <SignUpBtn
          src={SignupBtnSrc}
          mobileSrc={SignupBtnMobileSrc}
          hoverSrc={SignupBtnHoverSrc}
        />
      </div>
    </>
  );
};

export default withLoader(withMobileNav(withLayout(Page)));

/**
 * Get additional data from WordPress that is specific to this template.
 *
 * Here we retrieve the latest six WordPress posts in a named category to
 * display at the bottom of the front page.
 *
 * @see https://github.com/wpengine/headless-framework/tree/canary/docs/queries
 */
export async function getStaticProps(context: GetStaticPropsContext) {
  const client = getApolloClient(context);
  await getPosts(client, firstSixInCategory);
}
