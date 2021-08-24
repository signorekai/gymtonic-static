/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useElementScroll } from 'framer-motion';

import withMobileNav from 'components/MobileNav';
import withLoader, { WithLoaderProps } from 'components/Loader';
import VideoScroll from 'components/VideoScroll';
import withLayout from 'components/Layout';
import RightParallaxCard from 'components/RightParallaxCard';
import MobileNavBtn from 'components/MobileNavBtn';
import withSignUpForm from 'components/SignUpForm';
import GymLink from 'components/GymLink';

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
import SignupFooterBtnSrc from 'assets/images/SignUpButtons-7.png';
import SignupFooterBtnMobileSrc from 'assets/images/SignUpButtons-Small-7.png';
import SignupFooterExtraSrc from 'assets/images/signup-here.png';

const heightOfScroller = 5;

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
      linkStyle="home"
      className="absolute left-0 bottom-3 lg:bottom-8 text-center lg:text-left lg:pl-8 right-0 lg:right-auto"
    />
  </div>
);

const isMobile = () => {
  return window.innerWidth < 1024;
};

const Page: React.FunctionComponent<any> = ({
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
  const [showFooterBtn, setShowFooterBtn] = useState(false);
  const [showReminder, setShowReminder] = useState(true);
  const scroll = useElementScroll(container);
  const collapsed = useRef(false);

  useEffect(() => {
    if (container.current && leftViewport.current) {
      const handleScroll = () => {
        const scrollYProgress = scroll.scrollYProgress.get();
        const scrollY = scroll.scrollY.get();
        const parallaxLowerBound = isMobile()
          ? 1.5 / 8.5
          : heightOfScroller / (heightOfScroller + 7);
        const parallaxUpperBound = isMobile()
          ? 7.5 / 8.5
          : (heightOfScroller + 6) / (heightOfScroller + 7);

        // check if showing the cards
        if (
          scrollYProgress > parallaxLowerBound &&
          scrollYProgress <= parallaxUpperBound
        ) {
          if (showReminder === false) setShowReminder(true);
          if (showBtn === true) setShowBtn(false);
          if (showFooterBtn === true) setShowFooterBtn(false);
          setScrolledHeader(true);

          container.current?.classList.add('snap-container');

          const progress =
            (scrollY - parallaxLowerBound * container.current!.scrollHeight) /
            (window.innerHeight * 6);

          const leftValue =
            progress + 1 / leftViewport.current!.children.length;

          const newLeftPosition = Math.min(
            Math.max(1 - leftValue, 0),
            1 - 1 / leftViewport.current!.children.length,
          );

          leftViewport.current!.style.transform = `translate3d(0, ${
            newLeftPosition * -100
          }%, 0)`;
        } else if (scrollYProgress > parallaxUpperBound) {
          // in footer
          setScrolledHeader(true);
          setShowBtn(true);
          setShowFooterBtn(true);
          setShowReminder(false);
        } else {
          setShowReminder(true);
          collapsed.current = false;
          container.current?.classList.remove('snap-container');
        }
      };

      container.current?.addEventListener('scroll', handleScroll);
      const cachedContainer = container.current;

      return () => {
        cachedContainer?.removeEventListener('scroll', handleScroll);
      };
    }

    return () => {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, leftViewport]);

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
        height={heightOfScroller}
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
      <div className="flex-wrap flex flex-row">
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
            className="flex flex-col-reverse w-full h-screen-3 lg:h-screen-6 absolute">
            <LeftCard
              src={Gym1}
              url="/location/fei-yue-senior-activity-centre-bukit-batok/"
              linkText="Fei Yue Senior Activity Centre,<br/>Bukit Batok"
            />
            <LeftCard
              src={Gym2}
              url="/location/bishan-community-club"
              linkText="Bishan Community Club"
            />
            <LeftCard
              src={Gym3}
              url="/location/yong-en-active-ageing-centre/"
              linkText="Yong En Active Hub YEAH!,<br/>Bukit Merah"
            />
            <LeftCard
              src={Gym4}
              url="/location/care-corner-community-hub/"
              linkText="Care Corner Community Hub,<br/>Woodlands"
            />
            <LeftCard
              src={Gym5}
              url="/location/peacehaven-day-centre/"
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
          show
          className="lg:w-1/2 snap-end"
          headerTitle="Ka-Ching!"
          videoSrc="/videos/Thematic-2-KaChing.mp4"
          videoClassName="max-h-1/2 lg:max-h-none lg:max-w-2/5 lg:mt-24"
          paragraph="Hospital visits. Medication. Wheelchairs and domestic helpers. We know retiring is expensive. Here’s a cheaper way."
          href="/about"
          link="What is Gym Tonic?"
        />
        <RightParallaxCard
          className="lg:pl-[50vw] snap-end"
          videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/4 lg:mt-12"
          videoSrc="/videos/Thematic-3-Kakis.mp4"
          headerTitle="Kakis"
          paragraph="Help Pa and Ma make new friends."
          href="/locations"
          link="Find a gym near you"
        />
        <RightParallaxCard
          className="lg:pl-[50vw] snap-end"
          videoClassName="max-h-1/2 lg:max-h-none lg:max-w-2/5 lg:mt-20"
          videoSrc="/videos/Thematic-4-Boleh.mp4"
          headerTitle="Boleh"
          paragraph="To continue doing the things you love, you have to stay physically strong."
          href="/research"
          link="Why Strength Training matters even more when you are old."
        />
        <RightParallaxCard
          className="lg:pl-[50vw] snap-end"
          videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5 lg:mt-26"
          videoSrc="/videos/Thematic-5-Huat.mp4"
          headerTitle="Huat!"
          paragraph="4,000 seniors at 26 eldercare facilities have become stronger. See how they did it."
          href="/stories"
          link="Read their stories"
        />
        <RightParallaxCard
          className="lg:pl-[50vw] snap-end"
          videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/5 lg:mt-20"
          videoSrc="/videos/Thematic-6-Kilat.mp4"
          headerTitle="Kilat!"
          paragraph="State-of-the-art pneumatic and hydraulic equipment from Germany and Finland."
          href="/technology"
          link="Understand the process"
        />
        <RightParallaxCard
          className="lg:pl-[50vw] snap-end"
          videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5 lg:mt-20"
          videoSrc="/videos/Thematic-7-Pro.mp4"
          headerTitle="Pro"
          paragraph="Exercise trainers who will guide you every step of the way."
          href="/coaches"
          link="Meet the professionals"
        />
      </div>
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
            className="fixed w-full text-sm z-30 bottom-0 p-3 text-white">
            <motion.div
              className="w-full flex flex-col items-center"
              initial={{ translateY: 0 }}
              animate={{ translateY: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
              }}>
              <span className="">Scroll</span>
              <img src="images/down-arrow.svg" alt="" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        {showBtn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 lg:right-10 z-40">
            {showFooterBtn && (
              <div className="absolute -top-12 -left-20">
                <Image
                  width={100}
                  height={77}
                  src={SignupFooterExtraSrc}
                  alt=""
                />
              </div>
            )}
            <SignUpBtn
              setShowSignUpForm={setShowSignUpForm}
              src={showFooterBtn ? SignupFooterBtnSrc : SignupBtnSrc}
              mobileSrc={
                showFooterBtn ? SignupFooterBtnMobileSrc : SignupBtnMobileSrc
              }
              hoverSrc={showFooterBtn ? SignupFooterBtnSrc : SignupBtnHoverSrc}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))));
