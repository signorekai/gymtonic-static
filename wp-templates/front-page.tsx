/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePosts } from '@wpengine/headless/react';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import { getApolloClient, getPosts } from '@wpengine/headless';
import { AnimatePresence, motion, useAnimation, Variants } from 'framer-motion';

import debounce from 'lodash/debounce';

import { useScroll } from 'lib/hooks';
import VideoScroll from 'components/VideoScroll';
import withLayout, { WithLayoutProps } from 'components/Layout';
import RightParallaxCard from 'components/RightParallaxCard';
import { CTA, Posts } from 'components';

import Gym1 from 'assets/images/gym1.jpg';
import Gym2 from 'assets/images/gym2.jpg';
import Gym3 from 'assets/images/gym3.jpg';
import Gym4 from 'assets/images/gym4.jpg';
import Gym5 from 'assets/images/gym5.jpg';
import Gym6 from 'assets/images/gym6.jpg';

import styles from '../scss/wp-templates/front-page.module.scss';
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
      sizes="(min-width: 1366px) 800px, (min-width: 1024px) 600px, 400px"
      quality="100"
      objectFit="cover"
      placeholder="blur"
    />
  </div>
);

const FrontPage: React.FunctionComponent<WithLayoutProps> = ({
  setHeaderRef,
}: WithLayoutProps) => {
  const posts = usePosts(firstSixInCategory);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallaxScrollValues = useScroll(parallaxRef);

  const [parallaxIndex, setParallaxIndex] = useState<number>(0);

  const parallaxEffectRef = useRef<{
    previousIndex: number;
    maxCount: number;
    locked: boolean;
    leftParallaxPosition: number;
    rightParallaxPosition: number;
    direction: 'up' | 'down';
  }>({
    previousIndex: 0,
    maxCount: 6,
    locked: false,
    leftParallaxPosition: 0,
    rightParallaxPosition: 0,
    direction: 'down',
  });

  useEffect(() => {
    console.log(
      'index changed to',
      parallaxIndex,
      'from',
      parallaxEffectRef.current.previousIndex,
    );
  }, [parallaxIndex]);

  function handleScroll() {
    console.log('handleScroll');
    const { previousIndex, locked, maxCount, leftParallaxPosition } =
      parallaxEffectRef.current;
    if (locked) return;
    // if (parallaxScrollValues.scrollYProgress >= 1) return;

    // parallaxEffectRef.current.locked = true;

    let newIndex = Math.floor(
      parallaxScrollValues.scrollYProgress / (1 / maxCount),
    );

    if (newIndex > maxCount - 1) {
      newIndex = maxCount - 1;
    }

    if (previousIndex !== parallaxIndex) {
      parallaxEffectRef.current.previousIndex = parallaxIndex;
    }
    // parallaxEffectRef.current.currentIndex = newIndex;
    setParallaxIndex(newIndex);

    parallaxEffectRef.current.direction =
      leftParallaxPosition > parallaxScrollValues.scrollYProgress * -100
        ? 'down'
        : 'up';
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandler = useCallback(debounce(handleScroll, 100), [
    parallaxIndex,
    parallaxEffectRef,
  ]);

  const rightParallaxVariants: Variants = {
    hidden: { opacity: 1 },
    show: (custom: {
      maxCount: number;
      parallaxIndex: number;
      previousIndex: number;
    }) => ({
      y: `${
        (custom.maxCount - custom.parallaxIndex - 1) *
        (1 / custom.maxCount) *
        -100
      }%`,
      transition: {
        type: 'spring',
        staggerChildren: 0.1,
        // delayChildren:
        //   Math.abs(parallaxEffectRef.current.previousIndex - parallaxIndex) *
        //   0.3,
        duration: Math.abs(custom.previousIndex - custom.parallaxIndex) * 0.3,
        // duration: 0,
      },
    }),
  };

  useEffect(() => {
    console.log('>>>>>>>>>>>>>> RENDERING <<<<<<<<<<<<<<<<<');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandler, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', debouncedHandler);
      window.removeEventListener('resize', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedHandler, parallaxScrollValues]);

  return (
    <>
      <VideoScroll
        totalFrames={69}
        videoDuration={3}
        path="/images/home-video-frames"
        setHeaderRef={setHeaderRef}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            initial={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 30 }}
            transition={{ duration: 0.3, ease: [0.175, 0.85, 0.42, 0.96] }}
            className="relative z-40 text-center text-red mx-8 pointer-events-none">
            <h1 className="h1 text-red">Gym Tonic</h1>
            <h4 className="text-2xl md:text-3xl font-black leading-none">
              Exercise as Medicine
            </h4>
          </motion.div>
        </AnimatePresence>
      </VideoScroll>
      <main className="mb-screen">
        <section
          ref={parallaxRef}
          className="h-screen-5 lg:h-screen-4 relative z-30">
          <div className="sticky top-0 left-0 bg-red w-full h-screen flex flex-col lg:flex-row">
            <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
              <h1 className="h1 relative z-40 text-red">Gym</h1>
              <motion.div
                initial={{ y: 0 }}
                animate={{
                  y: `${
                    parallaxIndex *
                    (1 / parallaxEffectRef.current.maxCount) *
                    -100
                  }%`,
                  transition: {
                    type: 'spring',
                    duration:
                      Math.abs(
                        parallaxEffectRef.current.previousIndex - parallaxIndex,
                      ) * 0.25,
                    damping: 15,
                    // duration: 0,
                  },
                }}
                className="flex flex-col w-full h-screen-3 lg:h-screen-6 absolute z-30 top-0">
                <LeftCard src={Gym1} />
                <LeftCard src={Gym2} />
                <LeftCard src={Gym3} />
                <LeftCard src={Gym4} />
                <LeftCard src={Gym5} />
                <LeftCard src={Gym6} />
              </motion.div>
            </div>
            <div className="flex-1 bg-red text-white flex flex-col justify-center items-center relative overflow-hidden">
              <motion.div
                initial="hidden"
                animate="show"
                exit="hidden"
                custom={{
                  maxCount: parallaxEffectRef.current.maxCount,
                  parallaxIndex,
                  previousIndex: parallaxEffectRef.current.previousIndex,
                }}
                variants={rightParallaxVariants}
                className="flex flex-col-reverse w-full h-screen-3 lg:h-screen-6 absolute z-30 top-0">
                <RightParallaxCard
                  custom={{
                    ...parallaxEffectRef.current,
                  }}
                  headerTitle="Ka-Ching!"
                  ownIndex={0}
                  parallaxIndex={parallaxIndex}
                  videoSrc="/videos/Thematic-2-KaChing.mp4"
                  videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
                  paragraph="Hospital visits. Medication. Wheelchairs and domestic helpers. We know retiring is expensive. Here’s a cheaper way."
                  href="/about"
                  link="What is Gym Tonic?"
                />
                <RightParallaxCard
                  custom={{
                    ...parallaxEffectRef.current,
                  }}
                  videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/4"
                  videoSrc="/videos/Thematic-3-Kakis.mp4"
                  headerTitle="Kakis"
                  ownIndex={1}
                  parallaxIndex={parallaxIndex}
                  paragraph="Help Pa and Ma make new friends."
                  href="/locations"
                  link="Find a gym near you"
                />
                <RightParallaxCard
                  custom={{
                    ...parallaxEffectRef.current,
                  }}
                  videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
                  videoSrc="/videos/Thematic-4-Boleh.mp4"
                  headerTitle="Boleh"
                  ownIndex={2}
                  parallaxIndex={parallaxIndex}
                  paragraph="To continue doing the things you love, you have to stay physically strong."
                  href="/about"
                  link="Why Strength Training matters even more when you are old."
                />
                <RightParallaxCard
                  custom={{
                    ...parallaxEffectRef.current,
                  }}
                  videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
                  videoSrc="/videos/Thematic-5-Huat.mp4"
                  headerTitle="Huat!"
                  ownIndex={3}
                  parallaxIndex={parallaxIndex}
                  paragraph="4,000 seniors at 26 eldercare facilities have become stronger. See how they did it."
                  href="/stories"
                  link="Read their stories"
                />
                <RightParallaxCard
                  custom={{
                    ...parallaxEffectRef.current,
                  }}
                  videoClassName="max-h-2/5 lg:max-h-none lg:max-w-3/5"
                  videoSrc="/videos/Thematic-6-Kilat.mp4"
                  headerTitle="Kilat!"
                  ownIndex={4}
                  parallaxIndex={parallaxIndex}
                  paragraph="State-of-the-art pneumatic and hydraulic equipment from Germany and Finland."
                  href="/about"
                  link="Understand the process"
                />
                <RightParallaxCard
                  custom={{
                    ...parallaxEffectRef.current,
                  }}
                  videoClassName="max-h-3/5 lg:max-h-none lg:max-w-2/5"
                  videoSrc="/videos/Thematic-7-Pro.mp4"
                  headerTitle="Pro"
                  ownIndex={5}
                  parallaxIndex={parallaxIndex}
                  paragraph="Exercise trainers who will guide you every step of the way."
                  href="/about"
                  link="Meet the professionals"
                />
              </motion.div>
            </div>
          </div>
        </section>
        <section className="fixed top-0 w-full h-screen border-red border-10 md:border-60 z-20 flex flex-col justify-center items-center">
          <h1 className="!text-11xl h1 text-red italic relative z-10 mt-screen-2/10">
            Mai tu liao!
          </h1>
          <h4 className="h4 text-red relative z-10">
            Don't delay! Limited slots available.
          </h4>
          <video
            disablePictureInPicture
            controlsList="nodownload"
            playsInline
            autoPlay
            muted
            loop
            className="w-full h-full absolute top-0 left-0 z-0 object-cover object-center"
            src="/videos/Thematic-8-MaiTuLiao-H.mp4">
            <source src="/videos/Thematic-8-MaiTuLiao-H.mp4" type="video/mp4" />
          </video>
        </section>
      </main>
    </>
  );
};

export default withLayout(FrontPage);

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
