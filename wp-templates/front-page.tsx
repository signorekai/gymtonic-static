/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useElementScroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import withMobileNav from 'components/MobileNav';
import withLoader, { WithLoaderProps } from 'components/Loader';
import VideoScroll from 'components/VideoScroll';
import withLayout from 'components/Layout';
import RightParallaxCard from 'components/RightParallaxCard';
import MobileNavBtn from 'components/MobileNavBtn';

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
import withSignUpForm from 'components/SignUpForm';
import { useScroll } from 'lib/hooks';
import GymLink from 'components/GymLink';

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

const LeftCard = ({
  src,
  url,
  linkText,
}: {
  src: StaticImageData;
  url: string;
  linkText: string;
}) => (
  <div className="bg-white flex-1 w-full h-[50vh] lg:h-screen relative">
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
    <GymLink
      href={url}
      text={linkText}
      type="above"
      linkStyle="white"
      className="absolute left-0 bottom-3 lg:bottom-8 text-center lg:text-left lg:pl-8 right-0 lg:right-auto hover:cursor-locations"
    />
  </div>
);

const Page: React.FunctionComponent<any> = ({
  setHeaderRef,
  setShowMobileNav,
  setShowLoader,
  setShowSignUpForm,
  setScrolledHeader,
}: WithMobileNavProps &
  WithLayoutProps &
  WithLoaderProps &
  WithSignUpFormProps) => {
  const container = useRef<HTMLDivElement>(null);
  const leftViewport = useRef<HTMLDivElement>(null);

  const currentSlide = useRef(-1);

  const [showBtn, setShowBtn] = useState(true);

  const scrollTo = (index: number) => {
    if (currentSlide.current === -1) {
      container.current?.classList.add('snap-container');
    }

    currentSlide.current = index;
    let newLeftPosition = 0;

    if (leftViewport.current) {
      const progress = index / leftViewport.current.children.length;
      const leftValue = progress + 1 / leftViewport.current.children.length;

      newLeftPosition = Math.min(
        Math.max(1 - leftValue, 0),
        1 - 1 / leftViewport.current.children.length,
      );

      leftViewport.current.style.transform = `translate3d(0, ${
        newLeftPosition * -100
      }%, 0)`;
    }
  };

  return (
    <div
      id="container"
      ref={container}
      className="h-screen w-full overflow-y-scroll overflow-x-hidden relative flex-wrap flex flex-row">
      <div className="absolute top-6 right-6 text-white md:text-red md:top-20 md:right-20 z-40">
        <MobileNavBtn
          setShowMobileNav={setShowMobileNav}
          barStyle="text-white md:text-red"
        />
      </div>
      <VideoScroll
        onEnter={() => {
          container.current?.classList.remove('snap-container');
          setScrolledHeader(false);
          setShowBtn(true);
          currentSlide.current = -1;
        }}
        container={container}
        setShowLoader={setShowLoader}
        totalFrames={69}
        videoDuration={3}
        height={5}
        videoPath="/videos/home.mp4"
        path="/images/home-video-frames">
        <AnimatePresence exitBeforeEnter>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.175, 0.85, 0.42, 0.96] }}
            className="absolute top-1/3 -translate-y-1/2 left-0 z-30 w-full text-center text-red px-8 pointer-events-none">
            <h1 className="h1 text-red">Gym Tonic</h1>
            <h4 className="text-2xl md:text-3xl font-black leading-none">
              Exercise as Medicine
            </h4>
          </motion.div>
        </AnimatePresence>
      </VideoScroll>
      <div className="sticky top-0 left-0 inline-block z-20 w-full lg:w-1/2 h-screen-1/2 lg:h-screen overflow-hidden bg-red">
        <motion.div
          id="left"
          ref={leftViewport}
          initial="initial"
          animate="show"
          exit="exit"
          style={{
            transform: 'translate3d(0, -83.33%, 0)',
          }}
          className="flex flex-col-reverse w-full h-screen-3 lg:h-screen-6 absolute transition-transform duration-200">
          <LeftCard
            src={Gym1}
            url="/location/fei-yue-senior-activity-centre-bukit-batok/"
            linkText="Fei Yue Senior Activity Centre,<br/>Bukit Batok"
          />
          <LeftCard src={Gym2} url="/" linkText="Bishan Community Club" />
          <LeftCard
            src={Gym3}
            url="/location/care-corner-woodsquare-2/"
            linkText="Yong En Active Hub YEAH!,<br/>Bukit Merah"
          />
          <LeftCard
            src={Gym4}
            url="/"
            linkText="Care Corner Community Hub,<br/>Woodlands"
          />
          <LeftCard
            src={Gym5}
            url="/"
            linkText="The Salvation Army,<br/>Peacehaven Bedok Arena"
          />
          <LeftCard
            src={Gym6}
            url="/location/tzu-chi-foundation-seniors-engagement-enabling-node-nanyang"
            linkText="Tzu Chi Foundation Nanyang,<br/>Jurong West"
          />
        </motion.div>
        <h1 className="h1 absolute w-full top-1/2 -translate-y-1/2 z-10 text-red text-center">
          Gym
        </h1>
      </div>
      <RightParallaxCard
        onEnter={() => {
          if (currentSlide.current === -1) {
            setScrolledHeader(true);
            setShowBtn(false);
          }
          scrollTo(0);
        }}
        show={true}
        className="lg:w-1/2 snap-end"
        headerTitle="Ka-Ching!"
        videoSrc="/videos/Thematic-2-KaChing.mp4"
        videoClassName="max-h-1/2 lg:max-h-none lg:max-w-2/5"
        paragraph="Hospital visits. Medication. Wheelchairs and domestic helpers. We know retiring is expensive. Here’s a cheaper way."
        href="/about"
        link="What is Gym Tonic?"
      />
      <RightParallaxCard
        onEnter={() => {
          scrollTo(1);
        }}
        className="lg:pl-[50vw] snap-end"
        videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/4"
        videoSrc="/videos/Thematic-3-Kakis.mp4"
        headerTitle="Kakis"
        paragraph="Help Pa and Ma make new friends."
        href="/locations"
        link="Find a gym near you"
      />
      <RightParallaxCard
        onEnter={() => {
          scrollTo(2);
        }}
        className="lg:pl-[50vw] snap-end"
        videoClassName="max-h-1/2 lg:max-h-none lg:max-w-2/5"
        videoSrc="/videos/Thematic-4-Boleh.mp4"
        headerTitle="Boleh"
        paragraph="To continue doing the things you love, you have to stay physically strong."
        href="/research"
        link="Why Strength Training matters even more when you are old."
      />
      <RightParallaxCard
        onEnter={() => {
          scrollTo(3);
        }}
        className="lg:pl-[50vw] snap-end"
        videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
        videoSrc="/videos/Thematic-5-Huat.mp4"
        headerTitle="Huat!"
        paragraph="4,000 seniors at 26 eldercare facilities have become stronger. See how they did it."
        href="/stories"
        link="Read their stories"
      />
      <RightParallaxCard
        onEnter={() => {
          scrollTo(4);
        }}
        className="lg:pl-[50vw] snap-end"
        videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/5"
        videoSrc="/videos/Thematic-6-Kilat.mp4"
        headerTitle="Kilat!"
        paragraph="State-of-the-art pneumatic and hydraulic equipment from Germany and Finland."
        href="/technology"
        link="Understand the process"
      />
      <RightParallaxCard
        onEnter={() => {
          scrollTo(5);
        }}
        className="lg:pl-[50vw] snap-end"
        videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
        videoSrc="/videos/Thematic-7-Pro.mp4"
        headerTitle="Pro"
        paragraph="Exercise trainers who will guide you every step of the way."
        href="/coaches"
        link="Meet the professionals"
      />
      {/* <SnapperContainer
        length={6}
        onChange={(index) => {
          scrollTo(index);
          console.log('currently at slide', index);
        }}
        onExit={() => {
          setScrolledHeader(false);
          // container.current?.classList.remove('snap-container');
          setShowBtn(true);
          console.log(303);
        }}
        onEnter={() => {
          setScrolledHeader(true);
          // container.current?.classList.add('snap-container');
          setShowBtn(false);
        }}
      /> */}
      <section className="w-full h-screen border-red border-10 md:border-60 relative z-20 flex flex-col justify-center items-center snap-child">
        <h1 className="text-7xl md:text-9xl lg:text-11xl font-black leading-none mb-2 lg:mb-0 text-red italic relative z-10 mt-screen-2/10 text-center">
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
            window.innerWidth >= 1024
              ? '/videos/Thematic-8-MaiTuLiao-H.mp4'
              : '/videos/Thematic-9-MaiTuLiao-V.mp4'
          }>
          <source
            src={
              window.innerWidth >= 1024
                ? '/videos/Thematic-8-MaiTuLiao-H.mp4'
                : '/videos/Thematic-9-MaiTuLiao-V.mp4'
            }
            type="video/mp4"
          />
        </video>
      </section>
      <AnimatePresence exitBeforeEnter>
        {showBtn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 lg:right-10 z-40">
            <SignUpBtn
              setShowSignUpForm={setShowSignUpForm}
              src={SignupBtnSrc}
              mobileSrc={SignupBtnMobileSrc}
              hoverSrc={SignupBtnHoverSrc}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))));
