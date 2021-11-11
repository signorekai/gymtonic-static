import React, { useEffect, useRef, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { getNextStaticProps } from '@wpengine/headless/next';
import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { useRouter } from 'next/router';
import { find } from 'lodash';
import { motion } from 'framer-motion';

import withLayout from 'components/Layout';
import withSignUpForm from 'components/SignUpForm';
import withMobileNav from 'components/MobileNav';
import withLoader from 'components/Loader';

import Bubble from 'components/Bubble';
import StoryCard from 'components/StoryCard';
import MobileNavBtn from 'components/MobileNavBtn';

import SignUpBtn from 'components/SignUpButton';
import SignupBtnSrc from 'assets/images/SignUpButtons-1-1.png';
import SignupBtnHoverSrc from 'assets/images/SignUpButtons-1-2.png';
import SignupBtnMobileSrc from 'assets/images/SignUpButtons-Small-1.png';
import { useActiveHeader } from 'lib/hooks';

const storiesQuery = gql`
  {
    stories(
      where: { orderby: { field: MENU_ORDER, order: ASC } }
      first: 1000
    ) {
      edges {
        node {
          id
          title
          uri
          slug
          featuredImage {
            node {
              id
              mediaDetails {
                height
                width
              }
              sourceUrl(size: LARGE)
              placeholderSourceUrl: sourceUrl(size: PLACEHOLDER)
            }
          }
          storyFields {
            description
            videoTitle
            youtubeVideo
            gym {
              ... on Location {
                id
                uri
                title
                locationFields {
                  visibility
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface StoryFields {
  description: string;
  videoTitle: string;
  youtubeVideo: string;
  gym: Gym[];
}

interface StoryNode {
  id: string;
  title: string;
  uri: string;
  slug: string;
  featuredImage: {
    node: {
      id: string;
      sizes: string;
      sourceUrl: string;
      placeholderSourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
      };
    };
  };
  storyFields: StoryFields;
}

interface StoriesData {
  stories: {
    edges: {
      node: StoryNode;
    }[];
  };
}

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
  setShowMobileNav,
  setShowSignUpForm,
  setShowHeader,
}: WithLayoutProps & WithSignUpFormProps) => {
  const { data }: { data: StoriesData | undefined } = useQuery(storiesQuery);
  const stories = data?.stories.edges;

  const router = useRouter();
  const path = useRef<string>(router.asPath);

  const [selectedStory, setSelectedStory] = useState<StoryNode>();
  const [expanded, setExpanded] = useState(false);

  useActiveHeader(setShowHeader);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);

    if (path.current !== '/stories') {
      const current = find(
        stories,
        (story) => story.node.uri.slice(0, -1) === path.current,
      );

      if (current) {
        setSelectedStory(current.node);
        setExpanded(true);
        path.current = current.node.uri;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && typeof selectedStory === 'undefined') {
        if (stories && /stories/.exec(path.current))
          setSelectedStory(stories[0].node);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [stories, selectedStory, path]);

  return (
    <main className="flex flex-col lg:flex-row relative items-start page-stories">
      <div className="fixed pointer-events-auto top-6 md:top-12 leading-0 md:-translate-y-1/2 right-6 md:right-8 z-40">
        <MobileNavBtn
          setShowMobileNav={setShowMobileNav}
          barStyle={expanded ? 'text-white' : 'text-red'}
        />
      </div>
      <header
        className={`fixed pointer-events-none top-0 w-full pt-12 text-center z-30 lg:hidden ${
          expanded ? 'bg-red' : 'bg-white'
        }`}>
        <h1
          className={`page-title ${
            expanded ? 'text-white' : 'text-red'
          } relative z-20 pt-2 pb-4`}>
          Stories
        </h1>
      </header>
      <section
        className={`transition-all duration-200 order-2 lg:order-1 w-full md:min-h-screen ${
          expanded
            ? 'lg:w-3/10 pt-8 md:pt-14 lg:pt-14'
            : 'lg:w-1/2 pt-28 md:pt-40 lg:pt-14'
        } text-center z-20 flex flex-col justify-between`}>
        <motion.section
          variants={{
            initial: { opacity: 0, y: -20 },
            exit: { opacity: 0, y: -20 },
            show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
          }}
          initial="initial"
          exit="exit"
          animate="show"
          className="relative max-w-2xl md:w-10/12 h-auto mx-auto flex flex-row flex-wrap justify-center md:justify-start lg:pt-0 md:flex-last-item-align-start">
          <button
            type="button"
            className={`hover:cursor-pointer hidden lg:block w-full md:mt-20 ${
              expanded ? 'mb-4 lg:mb-8' : 'mb-20 lg:mb-8'
            }`}
            onClick={() => {
              setExpanded(false);
            }}>
            <h1 className="page-title text-red relative hidden lg:block w-full z-20">
              Stories
            </h1>
          </button>
          {/* <div className="hidden lg:block pointer-events-none fixed w-full top-0 h-64 z-10 bg-gradient-to-b from-white to-transparent" /> */}
          {stories?.map(({ node: story }) => (
            <Bubble
              id={story.slug}
              href={`#${story.slug}`}
              handler={(event: MouseEvent) => {
                event.preventDefault();
                setSelectedStory(story);
                setExpanded(true);

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const bubble = event.currentTarget;

                if (bubble instanceof Element && window.innerWidth >= 1024) {
                  setTimeout(() => {
                    const parent = bubble.parentElement;
                    if (parent !== null)
                      window.scrollTo({
                        top: parent.offsetTop,
                        behavior: 'smooth',
                      });
                  }, 250);
                }

                path.current = story.uri;
              }}
              borderColor={selectedStory?.id === story.id ? 'red' : 'white'}
              className={
                expanded
                  ? 'w-1/2 md:w-1/3 lg:w-full'
                  : 'w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3'
              }
              titleClassName={`${expanded ? 'md:max-w-1/2' : ''} text-base`}
              title={story.storyFields.videoTitle}
              subtitle={story.title}
              thumbnail={story.featuredImage.node.sourceUrl}
            />
          ))}
        </motion.section>
        <footer className="text-xs text-black text-center justify-self-end pb-4 max-w-2/3 py-8 mx-auto">
          <p>
            WhatsApp or call us at <a href="tel:96882388">9688 2388</a> or email{' '}
            <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
          </p>
          <p>
            An initiative by{' '}
            <a href="//lienfoundation.org/" target="_blank" rel="noreferrer">
              Lien Foundation
            </a>
          </p>
        </footer>
      </section>
      {selectedStory && (
        <StoryCard
          key={selectedStory.id}
          title={selectedStory?.title}
          isExpanded={expanded}
          videoTitle={selectedStory?.storyFields.videoTitle}
          youtubeVideo={selectedStory?.storyFields.youtubeVideo}
          description={selectedStory?.storyFields.description}
          gym={selectedStory?.storyFields.gym[0]}
        />
      )}
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps(context: GetStaticPropsContext) {
  const client = getApolloClient(context);
  await client.query({
    query: storiesQuery,
  });
  return getNextStaticProps(context);
}

export default withSignUpForm(
  withLoader(
    withMobileNav(
      withLayout(Page, {
        mobileNavBtnInHeader: false,
      }),
    ),
  ),
);
