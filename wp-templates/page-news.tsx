import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import React, { useEffect, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import withLayout, { WithLayoutProps } from 'components/Layout';
import withLoader from 'components/Loader';
import withMobileNav from 'components/MobileNav';
import Bubble from 'components/Bubble';

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
          id
          title
          date
          featuredImage {
            node {
              id
              mediaDetails {
                height
                width
              }
              sourceUrl(size: MEDIUM)
              largeSourceUrl: sourceUrl(size: LARGE)
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
            node: Media;
          }[];
        };
      }
    | undefined;
}

interface Media {
  id: string;
  title: string;
  date: string;
  formattedDate?: string;
  moreDetails: {
    description: string;
    publisher: string;
    typeOfLink: 'external_link' | 'pdf';
    url: string;
    file: {
      mediaItemUrl: string;
    };
  };
  featuredImage: {
    node: {
      id: string;
      sizes: string;
      sourceUrl: string;
      largeSourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
      };
    };
  };
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
  setMobileNavBtnStyle,
}: WithLayoutProps) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);
  const { data }: QueryData = useQuery(query);
  const press = data?.pressReleases.edges;
  const media = data?.mediaCoverages.edges;

  const mediaAnimationControl = useAnimation();

  const [selected, setSelected] = useState<Media | null>(null);

  const formatSelected = (item: Media): Media => {
    const d = new Date(item.date);
    const newSelected = { ...item };
    newSelected.formattedDate = `${
      d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate()
    } ${months[d.getMonth()]} ${d.getFullYear()}`;
    return newSelected;
  };

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);

    if (window.innerWidth >= 1024 && media) {
      const newSelected = formatSelected(media[0].node);
      setSelected(newSelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (media && selected === null) {
        const newSelected = formatSelected(media[0].node);
        setSelected(newSelected);
      }
    };

    window.addEventListener('resize', handleResize);

    if (selected) {
      setMobileNavBtnStyle('text-white');
      void mediaAnimationControl.start({
        maxHeight: '100vh',
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const selectedChildVariant = {
    initial: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

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
      className="flex flex-col lg:flex-row items-start min-h-screen">
      <section className="lg:flex lg:min-h-screen flex-col justify-start order-3 text-red lg:order-1 w-full lg:w-1/2">
        <header className="pointer-events-none top-0 w-full pt-12 lg:pt-20 text-center z-30">
          <motion.h1
            className={`page-title relative z-20 pt-2 pb-4 ${
              selected ? 'hidden lg:block' : 'block'
            }`}>
            News
          </motion.h1>
          <motion.h2
            variants={{
              initial: { y: -20, opacity: 0 },
              exit: { y: -20, opacity: 0 },
              enter: { y: 0, opacity: 1 },
            }}
            className="font-bold text-lg lg:text-xl mt-4 leading-none">
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
          className={`w-full md:w-5/6 lg:w-full flex flex-wrap flex-row mx-auto justify-center items-start mt-3 ${
            press && press.length > 4 ? 'flex-last-item-align-start' : ''
          }`}>
          {press?.map(({ node: item }) => (
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
                  <h1 className="mx-auto group-hover:opacity-90 transition-opacity font-black text-sm mt-1 md:text-base leading-none md:max-w-5/6">
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
        <section className="w-full mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-3 flex-last-item-align-start mx-auto md:w-10/12">
          {media?.map(({ node: item }) => {
            const date = new Date(item.date);
            return (
              <Bubble
                key={item.id}
                handler={() => {
                  setSelected(formatSelected(item));
                }}
                className="w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3"
                imageWrapperClassName={
                  item.id === selected?.id ? 'border-4' : 'border-0'
                }
                title={item.title}
                subtitle={`${
                  date.getDate().toString().length === 1
                    ? `0${date.getDate()}`
                    : date.getDate()
                } ${months[date.getMonth()]} ${date.getFullYear()}`}
                thumbnail={item.featuredImage.node.sourceUrl}
              />
            );
          })}
        </section>
      </section>
      <h1
        className={`${
          selected ? 'order-1 block' : 'hidden'
        } pt-14 pb-6 sticky w-full content-container-bg z-30 top-0 text-2xl md:text-5xl leading-none font-black text-center lg:hidden`}>
        News
      </h1>
      <motion.section
        initial={{ maxHeight: 0 }}
        animate={mediaAnimationControl}
        className={`content-container-bg content-container-size content-container-order content-container-positioning lg:min-h-screen content-container-px ${
          selected ? 'order-2' : ''
        }`}>
        <AnimatePresence exitBeforeEnter>
          {selected && (
            <motion.div
              key={selected.id}
              variants={{
                initial: { opacity: 0 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.3 },
                },
                exit: { opacity: 0 },
              }}
              initial="initial"
              animate="show"
              exit="exit"
              className="flex flex-col justify-center lg:min-h-screen">
              <motion.h3
                variants={selectedChildVariant}
                className="font-bold uppercase text-xs lg:pt-0 pt-6 md:pt-8">
                {selected.moreDetails.publisher}
              </motion.h3>
              <motion.h3
                variants={selectedChildVariant}
                className="font-bold uppercase text-xs">
                {selected.formattedDate}
              </motion.h3>
              <motion.h2
                variants={selectedChildVariant}
                className="font-bold text-lg md:text-2xl mt-3 leading-none">
                {selected.title}
              </motion.h2>
              {selected.featuredImage && (
                <motion.div
                  variants={selectedChildVariant}
                  className="w-full relative mt-3">
                  <Image
                    objectFit="cover"
                    width={selected.featuredImage.node.mediaDetails.width}
                    height={selected.featuredImage.node.mediaDetails.height}
                    sizes="(min-width: 1024px) 700px, 320px"
                    quality={90}
                    placeholder="blur"
                    blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUkpA4CAABqwENo/rLPQAAAABJRU5ErkJggg=="
                    src={selected.featuredImage.node.largeSourceUrl}
                  />
                </motion.div>
              )}
              <motion.p
                variants={selectedChildVariant}
                className="text-sm md:text-lg leading-tighter md:leading-tighter mb-10 mt-3">
                {selected.moreDetails.description}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
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
