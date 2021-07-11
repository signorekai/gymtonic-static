/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import withLayout from 'components/Layout';
import withLoader from 'components/Loader';
import withMobileNav from 'components/MobileNav';
import Bubble from 'components/Bubble';
import MapContainer from 'components/MapContainer';

interface QueryResult {
  data:
    | {
        openToPublic: {
          name: string;
          locations: Locations;
        };
        notOpenToPublic: {
          name: string;
          locations: Locations;
        };
      }
    | undefined;
}

interface Locations {
  edges: { node: ILocation }[] | undefined;
}

const query = gql`
  {
    openToPublic: status(id: "dGVybToz") {
      name
      locations(where: { orderby: { field: TITLE, order: ASC } }) {
        edges {
          node {
            id
            uri
            title
            locationFields {
              area
              contactNumber
              location {
                city
                country
                countryShort
                latitude
                longitude
                placeId
                postCode
                state
                stateShort
                streetAddress
                streetName
                streetNumber
                zoom
              }
              openingHours
              openingSoon
            }
            terms {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
            featuredImage {
              node {
                id
                mediaDetails {
                  height
                  width
                }
                sourceUrl(size: MEDIUM)
              }
            }
          }
        }
      }
    }
    notOpenToPublic: status(id: "dGVybTo0") {
      name
      locations(where: { orderby: { field: TITLE, order: ASC } }) {
        edges {
          node {
            id
            uri
            title
            locationFields {
              area
              contactNumber
              location {
                city
                country
                countryShort
                latitude
                longitude
                placeId
                postCode
                state
                stateShort
                streetAddress
                streetName
                streetNumber
                zoom
              }
              openingHours
              openingSoon
            }
            terms {
              nodes {
                id
                name
                termTaxonomyId
              }
            }
          }
        }
      }
    }
  }
`;

const Page: React.FunctionComponent<any> = ({
  setScrolledHeader,
  setShowLoader,
}: WithLayoutProps) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);

  const { data }: QueryResult = useQuery(query);
  const locationsOpenToPublic = data?.openToPublic.locations?.edges;
  const locationsNotOpenToPublic = data?.notOpenToPublic.locations?.edges;

  const [showInfo, setShowInfo] = useState(false);
  const [selected, setSelected] = useState<ILocation>();
  const [currentMapCenter, setCurrentMapCenter] = useState<LatLngLiteral>();
  const [activeInfoWindow, setActiveInfoWindow] = useState<
    IActiveInfoWindow | undefined
  >(undefined);

  const mapContainerControls = useAnimation();

  const clickHandler = useCallback(
    (location: ILocation) => {
      if (window && window.innerWidth >= 1024) {
        void mapContainerControls.start({
          width: window.innerWidth >= 1366 ? '70%' : '60%',
          transition: { delay: 0.2, duration: 0.4 },
        });
      }
      setSelected(location);
      setCurrentMapCenter({
        lat: location.locationFields.location.latitude,
        lng: location.locationFields.location.longitude,
      });

      setShowInfo(true);

      setActiveInfoWindow({
        position: {
          lat: location.locationFields.location.latitude,
          lng: location.locationFields.location.longitude,
        },
        title: location.title,
        id: location.id,
        visible: true,
      });
    },
    [mapContainerControls],
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => {
      setCurrentMapCenter({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      if (showInfo) {
        if (window.innerWidth >= 1024) {
          void mapContainerControls.start({
            width: window.innerWidth >= 1366 ? '70%' : '60%',
            transition: { delay: 0.2, duration: 0.4 },
          });
        } else {
          void mapContainerControls.start({
            width: '100%',
            transition: { delay: 0.2, duration: 0.4 },
          });
        }
      }
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [mapContainerControls, showInfo]);

  const markers = useMemo(() => {
    const allMarkers: Place[] = [];
    locationsOpenToPublic?.forEach(({ node: location }) => {
      allMarkers.push({
        position: {
          lat: location.locationFields.location.latitude,
          lng: location.locationFields.location.longitude,
        },
        icon: {
          url: '/images/map-icon.png',
          width: 31,
          height: 36,
        },
        title:
          location.locationFields.openingSoon === null ||
          location.locationFields.openingSoon === false
            ? location.title
            : `${location.title} - Opening Soon`,
        id: location.id,
        uri: location.uri,
        className:
          location.locationFields.openingSoon === null ||
          location.locationFields.openingSoon === false
            ? ''
            : 'hover:cursor-default',
        clickHandler: () => {
          if (
            location.locationFields.openingSoon === null ||
            location.locationFields.openingSoon === false
          ) {
            clickHandler(location);
          }
        },
      });
    });

    locationsNotOpenToPublic?.forEach(({ node: location }) => {
      allMarkers.push({
        position: {
          lat: location.locationFields.location?.latitude,
          lng: location.locationFields.location?.longitude,
        },
        icon: {
          url: '/images/map-icon-inactive.png',
          width: 31,
          height: 36,
        },
        id: location.id,
        mouseOverHandler: () => {
          setSelected(location);
        },
        mouseOutHandler: () => {
          setSelected(undefined);
        },
      });
    });

    return allMarkers;
  }, [locationsOpenToPublic, locationsNotOpenToPublic, clickHandler]);

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
      <section className="lg:flex w-full lg:w-auto lg:min-h-screen flex-col justify-start order-3 text-red lg:order-1 flex-1">
        <AnimatePresence exitBeforeEnter>
          {showInfo && (
            <motion.section
              variants={{
                initial: { x: '-100%', opacity: 0 },
                exit: { x: '-100%', opacity: 0 },
                enter: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.2,
                    when: 'beforeChildren',
                    staggerChildren: 0.1,
                  },
                },
              }}
              key="show-info"
              className="px-3 md:px-14 lg:px-5">
              <button
                className="ml-auto md:ml-0 md:mr-auto lg:mr-0 lg:ml-auto block"
                type="button"
                onClick={() => {
                  void mapContainerControls.start({
                    width: window && window.innerWidth >= 1024 ? '50%' : '100%',
                    transition: { duration: 0.4 },
                  });
                  setTimeout(() => {
                    setSelected(undefined);
                    setActiveInfoWindow(undefined);
                    setShowInfo(false);
                  }, 100);
                }}>
                <motion.h2
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: { y: 0, opacity: 1 },
                  }}
                  className="font-bold text-sm md:text-base mt-10 lg:mt-16 leading-none text-right">
                  {'<'} Where to find us
                </motion.h2>
              </button>
              <motion.h1
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="font-bold text-lg lg:text-xl mt-6 lg:mt-16 text-center lg:leading-none leading-none">
                {selected?.title}
              </motion.h1>
              <motion.h3
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="font-bold text-xs text-red text-center mt-8">
                Address
              </motion.h3>
              <motion.p
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="text-black font-bold text-xs text-center">
                {selected?.locationFields.location.streetNumber}{' '}
                {selected?.locationFields.location.streetAddress}{' '}
                {selected?.locationFields.location.postCode}
              </motion.p>
              <Link
                href={`https://www.google.com/maps?q=place_id:${selected?.locationFields.location.placeId}`}>
                <motion.a
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: { y: 0, opacity: 1 },
                  }}
                  className="font-bold text-xs text-red uppercase text-center block mt-3 underline"
                  target="_blank">
                  Get Directions
                </motion.a>
              </Link>
              <motion.h3
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="font-bold text-xs text-red text-center mt-8">
                Opening hours
              </motion.h3>
              <motion.p
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="text-black font-bold text-xs text-center"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: selected?.locationFields.openingHours ?? '',
                }}
              />
              <motion.h3
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="font-bold text-xs text-red text-center mt-8">
                Call us
              </motion.h3>
              <Link
                href={`tel:${selected?.locationFields.contactNumber}`}
                passHref>
                <motion.a
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: { y: 0, opacity: 1 },
                  }}
                  className="font-bold text-xs text-black uppercase text-center block"
                  target="_blank">
                  {selected?.locationFields.contactNumber}
                </motion.a>
              </Link>
            </motion.section>
          )}
          {!showInfo && (
            <motion.section
              variants={{
                initial: { x: 0, opacity: 1 },
                exit: { x: '100%', opacity: 1 },
                enter: { x: 0, opacity: 1 },
              }}
              key="show-list">
              <header className="pointer-events-none top-0 w-full pt-12 lg:pt-20 text-center z-30">
                <motion.h1 className="page-title relative z-20 pt-2 pb-4 block">
                  Where to find us
                </motion.h1>
                <motion.h2
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: { y: 0, opacity: 1 },
                  }}
                  className="font-bold text-lg lg:text-xl mt-4 leading-none">
                  Locations open to public
                </motion.h2>
              </header>
              <motion.section
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-4 flex-last-item-align-start mx-auto md:w-10/12">
                {locationsOpenToPublic?.map(({ node: location }) => {
                  return (
                    <Bubble
                      variants={{
                        initial: { y: -20, opacity: 0 },
                        exit: { y: 0, opacity: 1 },
                        enter: { y: 0, opacity: 1 },
                      }}
                      handler={() => {
                        clickHandler(location);
                      }}
                      className={`w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 ${
                        location.locationFields.openingSoon === true
                          ? 'pointer-events-none'
                          : ''
                      }`}
                      titleClassName="text-sm md:text-base"
                      imageWrapperClassName={`${
                        location.id === selected?.id ? 'border-4' : 'border-0'
                      } ${
                        location.locationFields.openingSoon === true
                          ? 'group-hover:border-0'
                          : ''
                      }`}
                      comingSoon={location.locationFields.openingSoon}
                      title={location.title}
                      subtitle={location.locationFields.area}
                      thumbnail={
                        location.featuredImage
                          ? location.featuredImage.node.sourceUrl
                          : '/images/map-no-icon.png'
                      }
                    />
                  );
                })}
              </motion.section>
              <motion.h2
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: { y: 0, opacity: 1 },
                }}
                className="font-bold text-lg lg:text-xl mt-8 leading-none text-center">
                By referral only
              </motion.h2>
              <motion.section
                variants={{
                  initial: { y: -20, opacity: 0 },
                  exit: { y: 0, opacity: 1 },
                  enter: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-4 flex-last-item-align-start mx-auto md:w-10/12">
                {locationsNotOpenToPublic?.map(({ node: item }) => {
                  return (
                    <motion.article
                      variants={{
                        initial: { y: -20, opacity: 0 },
                        exit: { y: 0, opacity: 1 },
                        enter: { y: 0, opacity: 1 },
                      }}
                      className="px-4 pb-8 md:pb-12 flex flex-col justify-center group z-20 w-1/3 lg:w-1/4 xl:w-1/4">
                      <div className="text-center">
                        <Image
                          layout="fixed"
                          src={
                            item.id === selected?.id
                              ? '/images/map-icon-active.png'
                              : '/images/map-icon-inactive.png'
                          }
                          width={31}
                          height={36}
                          quality={100}
                          objectFit="cover"
                          alt={item.title}
                        />
                        <h1 className="leading-none transition-all duration-200 mx-auto mx-au text-black font-black group-hover:opacity-80 text-sm md:text-base">
                          {item.title}
                        </h1>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.section>
            </motion.section>
          )}
        </AnimatePresence>
      </section>
      <motion.section
        animate={mapContainerControls}
        className="border-10 md:border-60 border-red order-2 lg:order-1 w-screen lg:w-screen-1/2 min-h-screen-1/2 lg:min-h-screen relative lg:sticky top-0">
        <MapContainer
          setSelected={setSelected}
          forceActiveInfoWindow={activeInfoWindow}
          initialCenter={markers[0].position}
          currentMapCenter={currentMapCenter}
          places={markers}
        />
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
