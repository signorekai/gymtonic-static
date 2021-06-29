import React, { useEffect, useRef } from 'react';
import { usePosts } from '@wpengine/headless/react';
import { GetStaticPropsContext } from 'next';
import { getApolloClient, getPosts } from '@wpengine/headless';
import VideoScroll from 'components/VideoScroll';
import withLayout, { WithLayoutProps } from 'components/Layout';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import { useScroll } from 'lib/hooks';
import { CTA, Posts } from 'components';
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

const FrontPage: React.FunctionComponent<WithLayoutProps> = ({
  setHeaderRef,
}: WithLayoutProps) => {
  const posts = usePosts(firstSixInCategory);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallaxControls = useAnimation();
  const parallaxScrollValues = useScroll(parallaxRef);

  const parallaxEffectRef = useRef<{
    currentIndex: number;
    maxCount: number;
    locked: boolean;
  }>({
    currentIndex: 0,
    maxCount: 6,
    locked: false,
  });

  const THRESHOLD = 0.3;

  useEffect(() => {
    function nextIndex() {
      const index = Math.min(
        parallaxEffectRef.current.currentIndex + 1,
        parallaxEffectRef.current.maxCount - 1,
      );
      parallaxEffectRef.current.currentIndex = index;

      if (parallaxRef.current) {
        console.log(
          'scrolling forward to',
          parallaxRef.current.offsetTop +
            (parallaxRef.current.clientHeight /
              parallaxEffectRef.current.maxCount) *
              parallaxEffectRef.current.currentIndex,
          index,
        );
        window.scrollTo({
          top:
            parallaxRef.current.offsetTop +
            (parallaxRef.current.clientHeight /
              parallaxEffectRef.current.maxCount) *
              parallaxEffectRef.current.currentIndex,
          behavior: 'smooth',
        });
      }

      setTimeout(() => {
        console.log('unlocked!', window.pageYOffset);
        parallaxEffectRef.current.locked = false;
      }, 1000);
    }

    function previousIndex() {
      const index = Math.max(0, parallaxEffectRef.current.currentIndex - 1);
      parallaxEffectRef.current.currentIndex = index;

      if (parallaxRef.current) {
        console.log(
          'scrolling back to',
          parallaxRef.current.offsetTop +
            (parallaxRef.current.clientHeight /
              parallaxEffectRef.current.maxCount) *
              parallaxEffectRef.current.currentIndex,
          index,
        );
        window.scrollTo({
          top:
            parallaxRef.current.offsetTop +
            (parallaxRef.current.clientHeight /
              parallaxEffectRef.current.maxCount) *
              parallaxEffectRef.current.currentIndex,
          behavior: 'smooth',
        });
      }

      setTimeout(() => {
        console.log('unlocked!', window.pageYOffset);
        parallaxEffectRef.current.locked = false;
      }, 1000);
    }

    function handleWheelEvent() {
      if (parallaxEffectRef.current.locked) return;
      if (
        parallaxScrollValues.scrollYProgress === 0 ||
        parallaxScrollValues.scrollYProgress === 1
      )
        return;

      console.log('attempting to snap!');
      parallaxEffectRef.current.locked = true;

      if (parallaxRef.current) {
        const actualThreshold =
          (parallaxRef.current.clientHeight /
            parallaxEffectRef.current.maxCount) *
          THRESHOLD;

        const currentIndexOffset =
          parallaxRef.current.offsetTop +
          (parallaxRef.current.clientHeight /
            parallaxEffectRef.current.maxCount) *
            parallaxEffectRef.current.currentIndex;

        // check distance to next threshold
        const previousThreshold =
          parallaxRef.current.offsetTop +
          (parallaxRef.current.clientHeight /
            parallaxEffectRef.current.maxCount) *
            (parallaxEffectRef.current.currentIndex - 1);
        const distanceToPreviousThreshold =
          window.pageYOffset - previousThreshold;

        // check distance to next threshold
        const nextThreshold =
          parallaxRef.current.offsetTop +
          (parallaxRef.current.clientHeight /
            parallaxEffectRef.current.maxCount) *
            (parallaxEffectRef.current.currentIndex + 1);

        const distanceToNextThreshold = nextThreshold - window.pageYOffset;

        if (
          window.pageYOffset < currentIndexOffset &&
          distanceToPreviousThreshold > actualThreshold
        ) {
          previousIndex();
        } else if (
          window.pageYOffset > currentIndexOffset &&
          distanceToNextThreshold > actualThreshold
        ) {
          nextIndex();
        } else {
          parallaxEffectRef.current.locked = false;
        }
      }

      // if (evt.deltaY > WHEEL_THRESHOLD) {
      //   nextIndex();
      // } else if (evt.deltaY < -WHEEL_THRESHOLD) {
      //   previousIndex();
      // } else {
      //   parallaxEffectRef.current.locked = false;
      // }
    }

    // function handleResize(evt: UIEvent) {
    // }
    window.addEventListener('scroll', handleWheelEvent);
    // window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleWheelEvent);
      // window.removeEventListener('resize', handleResize);
    };
  }, [parallaxScrollValues]);

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
            <h1 className="text-6xl md:text-8xl word-spacing-0 md:word-spacing-8 font-black leading-none mb-4 md:mb-0">
              Gym Tonic
            </h1>
            <h4 className="text-2xl md:text-3xl font-black leading-none">
              Exercise as Medicine
            </h4>
          </motion.div>
        </AnimatePresence>
      </VideoScroll>
      <main className="">
        <motion.section
          animate={parallaxControls}
          ref={parallaxRef}
          className="h-[600vh]">
          <div className="sticky top-0 left-0 bg-white w-screen h-screen flex flex-col lg:flex-row">
            <div className="flex-1">hi</div>
            <div className="flex-1 bg-red text-white">hi2</div>
          </div>
        </motion.section>
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
