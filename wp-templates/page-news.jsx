import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import React, { useEffect, useRef, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import withLayout from '../components/Layout';
import withLoader from '../components/Loader';
import withMobileNav from '../components/MobileNav';
import withSignUpForm from '../components/SignUpForm';
import Bubble from '../components/Bubble';

import SignUpBtn from '../components/SignUpButton';
import SignupBtnSrc from '../assets/images/SignUpButtons-6-1.png';
import SignupBtnHoverSrc from '../assets/images/SignUpButtons-6-2.png';
import SignupBtnMobileSrc from '../assets/images/SignUpButtons-Small-6.png';
import { useActiveHeader, useActiveHeaderForElement } from 'lib/hooks';

const query = gql`
  {
    pressReleases(
      where: { orderby: { field: DATE, order: DESC } }
      first: 1000
    ) {
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
    mediaCoverages(
      where: { orderby: { field: DATE, order: DESC } }
      first: 1000
    ) {
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
            showPhoto
            typeOfLink
            url
            file {
              mediaItemUrl
            }
            articlePhoto {
              sourceUrl(size: MEDIUM_LARGE)
            }
          }
        }
      }
    }
  }
`;

// interface QueryData {
//   data:
//     | {
//         pressReleases: {
//           edges: {
//             node: {
//               id: string;
//               title: string;
//               moreDetails: {
//                 typeOfLink: 'external_link' | 'pdf';
//                 url: string;
//                 file: {
//                   mediaItemUrl: string;
//                 };
//                 articlePhoto: {
//                   sourceUrl: string;
//                 };
//               };
//             };
//           }[];
//         };
//         mediaCoverages: {
//           edges: {
//             node: Media;
//           }[];
//         };
//       }
//     | undefined;
// }

// interface Media {
//   id: string;
//   title: string;
//   date: string;
//   formattedDate?: string;
//   moreDetails: {
//     description: string;
//     publisher: string;
//     typeOfLink: 'external_link' | 'pdf';
//     url: string;
//     showPhoto?: boolean;
//     file: {
//       mediaItemUrl: string;
//     };
//     articlePhoto: {
//       sourceUrl: string;
//     };
//   };
//   featuredImage: {
//     node: {
//       id: string;
//       sizes: string;
//       sourceUrl: string;
//       largeSourceUrl: string;
//       mediaDetails: {
//         height: number;
//         width: number;
//       };
//     };
//   };
// }

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

const Page = ({
  setScrolledHeader,
  setShowLoader,
  setMobileNavBtnStyle,
  setShowSignUpForm,
  setShowHeader,
}) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);
  const { data } = useQuery(query);
  const press = data?.pressReleases.edges;
  const media = data?.mediaCoverages.edges;
  const mediaAnimationControl = useAnimation();
  const newsPanel = useRef(null);

  const [selected, setSelected] = useState(null);

  const formatSelected = (item) => {
    const d = new Date(item.date);
    const newSelected = { ...item };
    newSelected.formattedDate = `${
      d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate()
    } ${months[d.getMonth()]} ${d.getFullYear()}`;
    return newSelected;
  };

  useActiveHeader(setShowHeader);
  useActiveHeaderForElement(setShowHeader, newsPanel);

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
      className="flex flex-col lg:flex-row items-start min-h-screen page-news">
      <section className="lg:flex lg:min-h-screen flex-col justify-start order-3 text-red lg:order-1 w-full lg:w-1/2">
        <header className="pointer-events-none top-0 w-full pt-12 lg:pt-20 text-center z-30">
          <motion.h1
            className={`page-title relative z-20 pt-2 pb-4 lg:pt-14 ${
              selected ? 'hidden lg:block' : 'block'
            }`}>
            News
          </motion.h1>
          <motion.h2
            variants={{
              initial: { y: -20, opacity: 0 },
              exit: { y: -20, opacity: 0 },
              enter: { y: 0, opacity: 1, transition: { delay: 0.1 } },
            }}
            className="font-bold text-lg lg:text-xl mt-4 leading-none">
            Press Release
          </motion.h2>
        </header>
        <motion.div
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
            enter: {
              y: 0,
              opacity: 1,
            },
          }}
          className={`w-full max-w-lg md:w-5/6 lg:w-full flex flex-wrap flex-row mx-auto justify-center items-start mt-3 ${
            press && press.length > 4 ? 'flex-last-item-align-start' : ''
          }`}>
          {press?.map(({ node: item }) => (
            <article className="w-1/4 mb-3 group text-center">
              <Link
                href={
                  item.moreDetails.typeOfLink === 'external_link'
                    ? item.moreDetails.url
                    : item.moreDetails.file.mediaItemUrl
                }>
                <a target="_blank">
                  <h1 className="mx-auto group-hover:opacity-90 transition-opacity font-black text-sm mt-1 md:text-base leading-none md:max-w-5/6 px-3 lg:px-0">
                    {item.title}
                  </h1>
                  <div className="w-7 h-7 relative mt-2 mx-auto">
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
            </article>
          ))}
        </motion.div>
        <motion.div
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
            enter: {
              y: 0,
              opacity: 1,
            },
          }}>
          <h2 className="font-bold text-lg lg:text-xl mt-6 md:mt-8 leading-none text-center">
            Media Coverage
          </h2>
          <section className="w-full max-w-2xl mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-3 flex-last-item-align-start mx-auto md:w-10/12">
            {media?.map(({ node: item }) => {
              const date = new Date(item.date);
              return (
                <Bubble
                  key={item.id}
                  handler={() => {
                    setSelected(formatSelected(item));
                  }}
                  borderColor={selected?.id === item.id ? 'red' : 'white'}
                  className="w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 focus:outline-none"
                  title={item.title}
                  subtitle={`${item.moreDetails.publisher}<br />${
                    date.getDate().toString().length === 1
                      ? `0${date.getDate()}`
                      : date.getDate()
                  } ${months[date.getMonth()]} ${date.getFullYear()}`}
                  thumbnail={
                    item.featuredImage
                      ? item.featuredImage.node.sourceUrl
                      : '/images/news-no-icon.png'
                  }
                />
              );
            })}
          </section>
        </motion.div>
        <footer className="text-xs text-black text-center justify-self-end pb-4 max-w-2/3 pt-8 mx-auto">
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
      <h1
        className={`${
          selected ? 'order-1 block' : 'hidden'
        } pt-14 pb-6 sticky w-full content-container-bg z-30 top-0 text-2xl md:text-5xl leading-none font-black text-center lg:hidden`}>
        News
      </h1>
      <motion.section
        ref={newsPanel}
        animate={mediaAnimationControl}
        className={`content-container-bg bg-red content-container-size content-container-order content-container-positioning lg:h-screen lg:overflow-y-auto lg:no-scrollbar content-container-px ${
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
              className={`flex flex-col lg:pt-22 lg:pb-12 lg:mx-1/20 ${
                (selected.featuredImage === null &&
                  selected.moreDetails.articlePhoto?.sourceUrl === null) ||
                selected.moreDetails.showPhoto === null
                  ? `justify-start lg:mt-32`
                  : `justify-center`
              }`}>
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
                className="font-black text-lg md:text-2xl mt-3 leading-none">
                {selected.title}
              </motion.h2>
              {(selected.featuredImage !== null ||
                selected.moreDetails.articlePhoto?.sourceUrl !== null) &&
                selected.moreDetails.showPhoto !== null && (
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
                      src={
                        selected.moreDetails.articlePhoto !== null &&
                        selected.moreDetails.articlePhoto?.sourceUrl !== null
                          ? selected.moreDetails.articlePhoto.sourceUrl
                          : selected.featuredImage.node.largeSourceUrl
                      }
                    />
                  </motion.div>
                )}
              <motion.p
                variants={selectedChildVariant}
                className="text-sm md:text-lg leading-tighter md:leading-tight mb-8 mt-3">
                {selected.moreDetails.description}
              </motion.p>
              <Link
                href={
                  selected.moreDetails.typeOfLink === 'external_link'
                    ? selected.moreDetails.url
                    : selected.moreDetails.file.mediaItemUrl
                }>
                <a
                  className="uppercase self-start text-xs mb-12 lg:mb-0 link"
                  target="_blank">
                  Read more
                </a>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
      <div className="fixed bottom-5 right-5 z-40">
        <SignUpBtn
          setShowSignUpForm={setShowSignUpForm}
          src={SignupBtnSrc}
          mobileSrc={SignupBtnMobileSrc}
          hoverSrc={SignupBtnHoverSrc}
        />
      </div>
    </motion.main>
  );
};

export async function getStaticProps(context) {
  const client = getApolloClient(context);
  await client.query({
    query,
  });
  return getNextStaticProps(context);
}

export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))));
