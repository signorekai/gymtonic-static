import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import React, { useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';

import withLayout, { WithLayoutProps } from 'components/Layout';
import withLoader from 'components/Loader';
import withMobileNav from 'components/MobileNav';
import Bubble, { Thumbnail } from 'components/Bubble';

const query = gql`
  {
    pressReleases(where: { orderby: { field: DATE, order: DESC } }) {
      edges {
        node {
          title
          moreDetails {
            typeOfLink
            url
            file {
              mediaItemUrl
            }
          }
        }
      }
    }
    mediaCoverages(where: { orderby: { field: DATE, order: DESC } }) {
      edges {
        node {
          title
          date
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
          moreDetails {
            description
            publisher
            typeOfLink
            url
            file {
              mediaItemUrl
            }
          }
        }
      }
    }
  }
`;

interface QueryData {
  data:
    | {
        pressReleases: {
          edges: {
            node: {
              id: string;
              title: string;
              moreDetails: {
                typeOfLink: 'external_link' | 'pdf';
                url: string;
                file: {
                  mediaItemUrl: string;
                };
              };
            };
          }[];
        };
        mediaCoverages: {
          edges: {
            node: {
              id: string;
              title: string;
              date: string;
              moreDetails: {
                description: string;
                publisher: string;
                typeOfLink: 'external_link' | 'pdf';
                url: string;
                file: {
                  mediaItemUrl: string;
                };
              };
              thumbnail: {
                thumbnail: Thumbnail;
              };
            };
          }[];
        };
      }
    | undefined;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
}: WithLayoutProps) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);
  const { data }: QueryData = useQuery(query);
  const press = data?.pressReleases.edges;
  const media = data?.mediaCoverages.edges;

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);

    console.log(JSON.stringify(press, null, '  '));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.main
      variants={{
        enter: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex flex-col lg:flex-row relative items-start min-h-screen">
      <section className="lg:flex lg:min-h-screen flex-col justify-start order-2 text-red lg:order-1 w-full lg:w-1/2">
        <header className="pointer-events-none top-0 w-full pt-16 text-center z-30">
          <h1 className="page-title relative z-20 mt-2">News</h1>
          <motion.h2
            variants={{
              initial: { y: -20, opacity: 0 },
              exit: { y: -20, opacity: 0 },
              enter: { y: 0, opacity: 1 },
            }}
            className="font-bold text-lg lg:text-xl mt-6 md:mt-8 leading-none">
            Press Release
          </motion.h2>
        </header>
        <motion.div
          variants={{
            initial: { y: 0, opacity: 0 },
            exit: { y: 0, opacity: 0 },
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="w-full md:w-5/6 flex flex-wrap flex-row mx-auto justify-center items-start mt-3">
          {press?.map(({ node: item }, index) => (
            <motion.article
              variants={{
                initial: { y: -20, opacity: 0 },
                exit: { y: -20, opacity: 0 },
                enter: { y: 0, opacity: 1 },
              }}
              className="w-1/4 mb-3 group text-center">
              <Link
                href={
                  item.moreDetails.typeOfLink === 'external_link'
                    ? item.moreDetails.url
                    : item.moreDetails.file.mediaItemUrl
                }>
                <a target="_blank">
                  <h1 className="group-hover:opacity-90 transition-opacity font-black text-sm mt-1 md:text-base leading-none md:max-w-5/6">
                    {item.title}
                  </h1>
                  <div className="w-7 h-7 relative mt-2 duration-200 transition-transform group-hover:-translate-y-1 mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      className="w-full"
                      viewBox="0 0 28 28">
                      <g transform="translate(-2601 1674)">
                        <g transform="translate(5858 -5932) rotate(90)">
                          <g
                            className="stroke-current"
                            transform="translate(4258 3229)"
                            fill="none"
                            strokeWidth="1.5">
                            <circle cx="14" cy="14" r="14" stroke="none" />
                            <circle cx="14" cy="14" r="13.25" fill="none" />
                          </g>
                        </g>
                        <path
                          d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                          transform="translate(5862.298 -5975.927) rotate(90)"
                          className="stroke-current"
                          fill="none"
                          strokeWidth="1.5"
                        />
                        <line
                          y2="11.719"
                          transform="translate(2615.004 -1666.047)"
                          fill="none"
                          className="stroke-current"
                          strokeWidth="1.5"
                        />
                      </g>
                    </svg>
                  </div>
                </a>
              </Link>
            </motion.article>
          ))}
        </motion.div>
        <motion.h2
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
            enter: {
              y: 0,
              opacity: 1,
              transition: { delay: press ? press?.length * 0.1 + 0.3 : 0.3 },
            },
          }}
          className="font-bold text-lg lg:text-xl mt-6 md:mt-8 leading-none text-center">
          Media Coverage
        </motion.h2>
        <motion.section
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                delay: press ? press?.length * 0.1 + 0.5 : 0.4,
                staggerChildren: 0.1,
              },
            },
          }}
          initial="initial"
          animate="enter"
          exit="exit"
          className="w-full mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-3 flex-last-item-align-start">
          {media?.map(({ node: item }) => {
            const date = new Date(item.date);
            return (
              <Bubble
                handler={() => {
                  // setSelectedStory(story);
                  // setExpanded(true);
                  // path.current = story.uri;
                }}
                className="w-1/2 md:w-1/3"
                // imageWrapperClassName={
                //   item.id === selectedItem?.id ? 'border-4' : 'border-0'
                // }
                title={item.title}
                subtitle={`${
                  date.getDate().toString().length === 1
                    ? `0${date.getDate()}`
                    : date.getDate()
                } ${months[date.getMonth()]} ${date.getFullYear()}`}
                thumbnail={item.thumbnail.thumbnail}
              />
            );
          })}
        </motion.section>
      </section>
      <section className="content-container">Hi</section>
    </motion.main>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps(context: GetStaticPropsContext) {
  const client = getApolloClient(context);
  await client.query({
    query,
  });
  return getNextStaticProps(context);
}

export default withLoader(withMobileNav(withLayout(Page)));
