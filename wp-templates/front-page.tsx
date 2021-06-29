import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { usePosts } from '@wpengine/headless/react';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import { getApolloClient, getPosts } from '@wpengine/headless';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import debounce from 'lodash/debounce';

import { useScroll } from 'lib/hooks';
import VideoScroll from 'components/VideoScroll';
import withLayout, { WithLayoutProps } from 'components/Layout';
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
      objectFit="cover"
      placeholder="blur"
    />
  </div>
);

const RightCard = ({
  children,
  className = 'bg-white',
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => (
  <div
    className={`flex flex-col justify-center items-center w-full h-screen-1/2 lg:h-screen relative ${className}`}>
    {children}
  </div>
);

const FrontPage: React.FunctionComponent<WithLayoutProps> = ({
  setHeaderRef,
}: WithLayoutProps) => {
  const posts = usePosts(firstSixInCategory);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallaxScrollValues = useScroll(parallaxRef);

  const leftParallax = useRef<HTMLDivElement>(null);
  const leftParallaxControl = useAnimation();

  const rightParallax = useRef<HTMLDivElement>(null);
  const rightParallaxControl = useAnimation();

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

  function handleScroll() {
    console.log('handleScroll');
    const { previousIndex, locked, maxCount, leftParallaxPosition, direction } =
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

    console.log(parallaxEffectRef.current.previousIndex, parallaxIndex);
    
    if (parallaxEffectRef.current.previousIndex !== parallaxIndex) {
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

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandler, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', debouncedHandler);
      window.removeEventListener('resize', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedHandler, leftParallaxControl, parallaxScrollValues]);

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
      <main className="">
        <section ref={parallaxRef} className="h-screen-3">
          <div className="sticky top-0 left-0 bg-white w-full h-screen flex flex-col lg:flex-row">
            <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
              <h1 className="h1 relative z-40 text-red">Gym</h1>
              <motion.div
                ref={leftParallax}
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
                      ) * 0.3,
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
                ref={rightParallax}
                initial={{
                  y: `${(1 / parallaxEffectRef.current.maxCount) * 100 - 100}%`,
                }}
                animate={{
                  y: `${
                    (parallaxEffectRef.current.maxCount - parallaxIndex - 1) *
                    (1 / parallaxEffectRef.current.maxCount) *
                    -100
                  }%`,
                  transition: {
                    type: 'spring',
                    duration:
                      Math.abs(
                        parallaxEffectRef.current.previousIndex - parallaxIndex,
                      ) * 0.3,
                    // duration: 0,
                  },
                }}
                className="flex flex-col-reverse w-full h-screen-3 lg:h-screen-6 absolute z-30 top-0">
                <RightCard className="bg-red">
                  <h1 className="h1 text-white">1</h1>
                </RightCard>
                <RightCard>
                  <h1 className="h1 text-red">2</h1>
                </RightCard>
                <RightCard className="bg-red">
                  <h1 className="h1 text-white">3</h1>
                </RightCard>
                <RightCard>
                  <h1 className="h1 text-red">4</h1>
                </RightCard>
                <RightCard className="bg-red">
                  <h1 className="h1 text-white">5</h1>
                </RightCard>
                <RightCard>
                  <h1 className="h1 text-red">6</h1>
                </RightCard>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <main className="">
        <section className={styles.explore}>
          <div className="wrap">
            <h2>Explore this Example Project</h2>
            <p>
              This headless example project uses{' '}
              <a href="https://nextjs.org/">Next.js</a>,{' '}
              <a href="https://graphql.org/">GraphQL</a>,{' '}
              <a href="https://www.apollographql.com/">Apollo</a> and the{' '}
              <a href="https://www.npmjs.com/package/@wpengine/headless">
                WP&nbsp;Engine headless package
              </a>{' '}
              for WordPress integration. Dive in and edit this template at{' '}
              <code>wp-templates/front-page.tsx</code> or discover more below.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3>Page Templates</h3>
                <p>
                  Find templates in the the <code>wp-templates/</code> folder.
                  These use the same convention as the{' '}
                  <a href="https://developer.wordpress.org/themes/basics/template-hierarchy/">
                    WordPress template hierarchy
                  </a>
                  , where <code>single.tsx</code> displays posts and{' '}
                  <code>page.tsx</code> displays pages. Find page-specific CSS
                  at <code>scss/wp-templates</code>, which is scoped to the page
                  with{' '}
                  <a href="https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css">
                    CSS modules
                  </a>
                  .
                </p>
              </div>

              <div className={styles.feature}>
                <h3>Global Styles and Fonts</h3>
                <p>
                  Add styles to load on every page, such as typography and
                  layout rules, in <code>scss/main.scss</code>. The project adds{' '}
                  <a href="https://necolas.github.io/normalize.css/">
                    normalize.css
                  </a>{' '}
                  in <code>pages/_app.tsx</code>. Google Fonts are enqueued in{' '}
                  <code>components/Header.tsx</code>.
                </p>
              </div>

              <div className={styles.feature}>
                <h3>Components</h3>
                <p>
                  Add or edit components in the <code>components/</code> folder.
                  Find component styles at <code>scss/components</code>, which
                  use{' '}
                  <a href="https://nextjs.org/docs/basic-features/built-in-css-support#adding-component-level-css">
                    CSS modules
                  </a>{' '}
                  to scope CSS to each component.
                </p>
              </div>

              <div className={styles.feature}>
                <h3>Hooks</h3>
                <p>
                  Fetch data from WordPress with <code>usePost</code>,{' '}
                  <code>usePosts</code>, <code>useGeneralSettings</code> and
                  other custom hooks. Use these hooks in your page templates to
                  pass data to custom components. See{' '}
                  <code>wp-templates/front-page.tsx</code> for examples.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Posts
          posts={posts?.nodes}
          heading="Latest Posts"
          intro="The Posts component in wp-templates/front-page.tsx shows the latest six posts from the connected WordPress site."
          headingLevel="h2"
          postTitleLevel="h3"
          id={styles.post_list}
        />
        <CTA
          title="Questions or comments?"
          buttonText="Join the discussion on GitHub"
          buttonURL="https://github.com/wpengine/headless-framework/discussions"
          headingLevel="h2">
          <p>
            We welcome feature requests, bug reports and questions in the{' '}
            <a href="https://github.com/wpengine/headless-framework">
              Headless Framework GitHub repository
            </a>
            .
          </p>
        </CTA>
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
