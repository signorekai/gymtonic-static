import React, { useContext, useEffect, useRef, useState } from 'react';
import { getNextStaticProps } from '@wpengine/headless/next';
import withLayout, { WithLayoutProps } from 'components/Layout';
import { LoaderContext, LoaderContextType } from 'pages/_app';
import { gql, useQuery } from '@apollo/client';
import { GetStaticPropsContext } from 'next';
import { getApolloClient } from '@wpengine/headless';
import Bubble, { Thumbnail } from 'components/Bubble';
import StoryCard from 'components/StoryCard';
import { useRouter } from 'next/router';
import { find } from 'lodash';
import withMobileNav from 'components/MobileNav';

const storiesQuery = gql`
  {
    stories(where: { orderby: { field: TITLE, order: ASC } }) {
      edges {
        node {
          id
          title
          uri
          thumbnail {
            thumbnail {
              id
              sizes
              sourceUrl
              mediaDetails {
                height
                width
              }
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
              }
            }
          }
        }
      }
    }
  }
`;

export interface Gym {
  id: string;
  uri: string;
  title: string;
}

interface StoryFields {
  description: string;
  videoTitle: string;
  youtubeVideo: string;
  gym: Gym[];
}

export interface StoryNode {
  id: string;
  title: string;
  uri: string;
  thumbnail: {
    thumbnail: Thumbnail;
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
}: WithLayoutProps) => {
  const { data }: { data: StoriesData | undefined } = useQuery(storiesQuery);
  const stories = data?.stories.edges;

  const setShowLoader = useContext<LoaderContextType>(LoaderContext);

  const router = useRouter();
  const path = useRef<string>(router.asPath);

  const [selectedStory, setSelectedStory] = useState<StoryNode>();
  const [expanded, setExpanded] = useState(false);

  const clickHandler = (story: StoryNode) => {
    setSelectedStory(story);
    setExpanded(true);
    path.current = story.uri;
  };

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (path.current !== '/stories') {
      const current = find(
        stories,
        (story) => story.node.uri.slice(0, -1) === router.asPath,
      );
      if (current) {
        clickHandler(current.node);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && typeof selectedStory === 'undefined') {
        if (stories) setSelectedStory(stories[0].node);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [stories, selectedStory]);

  return (
    <main className="flex flex-col lg:flex-row relative">
      <header
        className={`fixed pointer-events-none top-0 w-full pt-18 text-center z-30 lg:hidden ${
          expanded ? 'bg-red' : 'bg-white'
        }`}>
        <h1
          className={`page-title ${
            expanded ? 'text-white' : 'text-red'
          } relative z-20 pt-4 md:pt-4 pb-2`}>
          Stories
        </h1>
      </header>
      <section
        className={`transition-all duration-200 order-2 lg:order-1 w-full lg:min-h-screen ${
          expanded ? 'lg:w-3/10' : 'lg:w-1/2'
        } pt-8 md:pt-14 lg:pt-14 text-center z-30`}>
        <h1 className="page-title text-red relative hidden lg:block z-40 pt-24 md:pt-14">
          Stories
        </h1>
        <section
          className={`relative md:w-10/12 h-auto mx-auto flex flex-row flex-wrap justify-center items-start ${
            expanded ? 'mt-4 lg:mt-8' : 'mt-34 lg:mt-4'
          } lg:pt-0 after:empty-content after:flex-1`}>
          {/* <div className="hidden lg:block pointer-events-none fixed w-full top-0 h-64 z-10 bg-gradient-to-b from-white to-transparent" /> */}
          {stories?.map(({ node: story }) => (
            <Bubble
              handler={clickHandler}
              isExpanded={expanded}
              isHighlighted={story.id === selectedStory?.id}
              uri={story.uri}
              story={story}
            />
          ))}
        </section>
      </section>
      {/* <section className="bg-red sticky top-0 z-30 w-full pt-28 lg:hidden">
        <h2 className="page-title lg:hidden text-white relative z-40 text-center mb-6">
          Stories
        </h2>
      </section> */}
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

export default withMobileNav(withLayout(Page));
