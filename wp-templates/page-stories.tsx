import React, { useContext, useEffect } from 'react';
import { getNextStaticProps } from '@wpengine/headless/next';
import withLayout, { WithLayoutProps } from 'components/Layout';
import { LoaderContext, LoaderContextType } from 'pages/_app';
import { gql, useQuery } from '@apollo/client';
import { GetStaticPropsContext } from 'next';
import { getApolloClient } from '@wpengine/headless';
import Bubble, { Thumbnail } from 'components/Bubble';
import { useRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
// const useLoaderContext = (): LoaderContextType => useContext(LoaderContext);

const storiesQuery = gql`
  {
    stories {
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

interface Gym {
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

interface StoriesData {
  stories: {
    edges: {
      node: {
        id: string;
        title: string;
        uri: string;
        thumbnail: {
          thumbnail: Thumbnail;
        };
        storyFields: StoryFields;
      };
    }[];
  };
}

const Stories: React.FunctionComponent<WithLayoutProps> = ({
  setScrolledHeader,
}: WithLayoutProps) => {
  const { data }: { data: StoriesData | undefined } = useQuery(storiesQuery);
  const stories = data?.stories.edges;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { setShowLoader }: LoaderContextType = useContext(LoaderContext);
  const router = useRouter();

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <main className="flex flex-row">
      <section className="w-full lg:w-1/2 pt-28 text-center">
        <h1 className="pageTitle">Stories</h1>
        <section className="flex flex-row flex-wrap justify-center items-center after:empty-content after:flex-1">
          {stories?.map(({ node: story }, index) => (
            <Bubble
              isHighlighted={index === 0}
              uri={story.uri}
              thumbnail={story.thumbnail.thumbnail}
              itemTitle={story.title}
              videoTitle={story.storyFields.videoTitle}
            />
          ))}
        </section>
      </section>
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

export default withLayout(Stories);
