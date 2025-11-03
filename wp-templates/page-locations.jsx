import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps, useUriInfo } from '@wpengine/headless/next';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { find } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';

import withLayout from '../components/Layout';
import withLoader from '../components/Loader';
import withMobileNav from '../components/MobileNav';
import withSignUpForm from '../components/SignUpForm';

import Bubble from '../components/Bubble';
import MapContainer from '../components/MapContainer';
import Carousel, { CarouselCard } from '../components/Carousel';

import SignUpBtn from '../components/SignUpButton';
import SignupBtnSrc from '../assets/images/SignUpButtons-4-1.png';
import SignupBtnHoverSrc from '../assets/images/SignUpButtons-4-2.png';
import SignupBtnMobileSrc from '../assets/images/SignUpButtons-Small-4.png';
import { useActiveHeader } from '../lib/hooks';

// interface QueryResult {
//   data:
//     | {
//         openToPublic: {
//           name: string;
//           locations: Locations;
//         };
//         notOpenToPublic: {
//           name: string;
//           locations: Locations;
//         };
//       }
//     | undefined;
// }

// interface Locations {
//   edges: { node: ILocation }[] | undefined;
// }

const query = gql`
  {
    openToPublic: status(id: "dGVybToz") {
      name
      locations(
        where: { orderby: { field: MENU_ORDER, order: ASC }, status: PUBLISH }
        first: 1000
      ) {
        edges {
          node {
            id
            uri
            slug
            title
            locationFields {
              area
              address
              openingSoon2026
              clickable
              contactNumber
              images {
                nodes {
                  sourceUrl(size: CAROUSEL_MEDIUM)
                  mediaDetails {
                    width
                    height
                  }
                }
              }
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
              visibility
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
      locations(
        where: { orderby: { field: MENU_ORDER, order: ASC }, status: PUBLISH }
        first: 1000
      ) {
        edges {
          node {
            id
            uri
            slug
            title
            locationFields {
              area
              address
              openingSoon2026
              contactNumber
              images {
                nodes {
                  sourceUrl(size: CAROUSEL_MEDIUM)
                  mediaDetails {
                    width
                    height
                  }
                }
              }
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
              visibility
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
  }
`;

const Page = ({
  setScrolledHeader,
  setShowLoader,
  setShowSignUpForm,
  setMobileNavBtnStyle,
  setShowHeader,
}) => {
  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);

  const { data } = useQuery(query);
  const locationsOpenToPublic = data?.openToPublic.locations?.edges;
  const locationsNotOpenToPublic = data?.notOpenToPublic.locations?.edges;

  const [showInfo, setShowInfo] = useState(false);
  const [selected, setSelected] = useState();
  const [currentMapCenter, setCurrentMapCenter] = useState();
  const [activeInfoWindow, setActiveInfoWindow] = useState(undefined);

  const mapContainerControls = useAnimation();
  const uriInfo = useUriInfo();

  useActiveHeader(setShowHeader);

  const clickHandler = useCallback(
    (selectedLocation, evt = new Event('null'), pushState = true) => {
      if (evt.type !== 'null') {
        evt?.preventDefault();
      }
      if (window && window.innerWidth >= 1024) {
        void mapContainerControls.start({
          width: window.innerWidth >= 1366 ? '70%' : '60%',
          transition: { delay: 0.2, duration: 0.4 },
        });

        window.scrollTo(0, 0);
      }

      if (pushState) {
        window.history.pushState(
          {},
          '',
          `${window.location.origin}${selectedLocation.uri}`,
        );
      }

      setShowInfo(true);
      setSelected(selectedLocation);
      setCurrentMapCenter({
        lat: selectedLocation.locationFields.location.latitude,
        lng: selectedLocation.locationFields.location.longitude,
      });
      setActiveInfoWindow({
        position: {
          lat: selectedLocation.locationFields.location.latitude,
          lng: selectedLocation.locationFields.location.longitude,
        },
        title: selectedLocation.title,
        id: selectedLocation.id,
        visible: true,
        style: 'red',
      });
    },
    [mapContainerControls],
  );

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));

    const listener = () => {
      if (/\/location\//.exec(window.location.pathname)) {
        const inOpenToPublic = find(locationsOpenToPublic, (location) => {
          return location.node.uri === window.location.pathname;
        });
        if (
          inOpenToPublic &&
          inOpenToPublic.node.locationFields.openingSoon === null
        ) {
          clickHandler(inOpenToPublic.node, new Event('null'), false);
        }
      } else if (/locations/.exec(window.location.pathname)) {
        void mapContainerControls.start({
          width: window && window.innerWidth >= 1024 ? '50%' : '100%',
          transition: { duration: 0.4 },
        });
        setTimeout(() => {
          setSelected(undefined);
          setActiveInfoWindow(undefined);
          setShowInfo(false);
        }, 100);
      }
    };

    window.addEventListener('popstate', listener);

    return () => {
      window.removeEventListener('popstate', listener);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      uriInfo?.uriPath !== '/gymtonic/locations' &&
      uriInfo?.uriPath !== '/locations' &&
      selected === undefined
    ) {
      const inOpenToPublic = find(locationsOpenToPublic, (location) => {
        return location.node.uri === `/${uriInfo?.uriPath}/`;
      });

      if (
        inOpenToPublic &&
        inOpenToPublic.node.locationFields.openingSoon === null
      ) {
        clickHandler(inOpenToPublic.node);
      } else if (inOpenToPublic === undefined) {
        const inNotOpenToPublic = find(locationsNotOpenToPublic, (location) => {
          return location.node.uri === `/${uriInfo?.uriPath}/`;
        });

        if (inNotOpenToPublic) {
          setCurrentMapCenter({
            lat: inNotOpenToPublic.node.locationFields.location.latitude,
            lng: inNotOpenToPublic.node.locationFields.location.longitude,
          });
          setActiveInfoWindow({
            position: {
              lat: inNotOpenToPublic.node.locationFields.location.latitude,
              lng: inNotOpenToPublic.node.locationFields.location.longitude,
            },
            title: inNotOpenToPublic.node.title,
            id: inNotOpenToPublic.node.id,
            visible: true,
            style: 'white',
          });
        } else {
          navigator.geolocation.getCurrentPosition((p) => {
            setCurrentMapCenter({
              lat: p.coords.latitude,
              lng: p.coords.longitude,
            });
          });
        }
      }
    } else {
      navigator.geolocation.getCurrentPosition((p) => {
        setCurrentMapCenter({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsOpenToPublic, locationsNotOpenToPublic, uriInfo?.uriPath]);

  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
        setMobileNavBtnStyle('text-white');
      } else {
        setMobileNavBtnStyle('text-red');
      }

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
  }, [mapContainerControls, setMobileNavBtnStyle, showInfo]);

  const markers = useMemo(() => {
    const allMarkers = [];
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
          (location.locationFields.openingSoon === null ||
          location.locationFields.openingSoon === false) && (
            location.locationFields.openingSoon2026 === null ||
            location.locationFields.openingSoon2026 === false 
          )
            ? location.title
            : `${location.title} - Opening Soon`,
        id: location.id,
        uri: location.uri,
        className:
          (location.locationFields.openingSoon === null ||
          location.locationFields.openingSoon === false) || (
            location.locationFields.openingSoon2026 === null ||
            location.locationFields.openingSoon2026 === false 
          )
            ? ''
            : 'hover:cursor-default',
        clickHandler: () => {
          if (
            (location.locationFields.openingSoon === null ||
            location.locationFields.openingSoon === false) || (
              location.locationFields.openingSoon2026 === null ||
              location.locationFields.openingSoon2026 === false 
            )
          ) {
            clickHandler(location);
          }
        },
        clickable: location.locationFields.openingSoon === false && location.locationFields.openingSoon2026 === false,
      });
    });

    locationsNotOpenToPublic?.forEach(({ node: location }) => {
      allMarkers.push({
        position: {
          lat: location.locationFields.location?.latitude,
          lng: location.locationFields.location?.longitude,
        },
        className: 'hover:cursor-default',
        icon: {
          url: '/images/map-icon-inactive.png',
          width: 31,
          height: 36,
        },
        title: location.title,
        id: location.id,
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
      className="flex flex-col lg:flex-row relative items-start min-h-screen page-locations">
      <section className="lg:flex w-full lg:w-auto lg:min-h-screen flex-col justify-start order-3 text-red lg:order-1 flex-1">
        <AnimatePresence exitBeforeEnter>
          {showInfo && (
            <motion.section
              variants={{
                initial: { y: -20, opacity: 0 },
                exit: { y: -20, opacity: 0 },
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.2,
                    when: 'beforeChildren',
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="flex flex-col lg:min-h-screen justify-between"
              key="show-info">
              <section className="flex-1 flex flex-col justify-between">
                <div className="px-3 md:px-14 lg:px-5">
                  <button
                    className="ml-auto md:ml-0 md:mr-auto lg:mr-0 lg:ml-auto block"
                    type="button"
                    onClick={() => {
                      void mapContainerControls.start({
                        width:
                          window && window.innerWidth >= 1024 ? '50%' : '100%',
                        transition: { duration: 0.4 },
                      });
                      setTimeout(() => {
                        setSelected(undefined);
                        setActiveInfoWindow(undefined);
                        setShowInfo(false);
                        window.history.pushState(
                          {},
                          '',
                          `${window.location.origin}/locations`,
                        );
                      }, 100);
                    }}>
                    <h2 className="font-bold text-sm md:text-base mt-10 lg:mt-16 leading-none text-right">
                      {'<'} Where to find us
                    </h2>
                  </button>
                  <h1 className="font-black text-lg lg:text-xl mt-6 lg:mt-16 text-center leading-tight">
                    {selected?.title}
                  </h1>
                  <h3 className="font-bold text-xs text-red text-center mt-8">
                    Address
                  </h3>
                  <p
                    className="text-black font-bold text-xs text-center leading-tight lg:max-w-1/2 mx-auto block"
                    dangerouslySetInnerHTML={{
                      __html: selected?.locationFields.address
                        ? selected.locationFields.address
                        : '',
                    }}
                  />
                  <Link
                    passHref
                    href={`https://www.google.com/maps/search/?api=1&query=${selected?.locationFields.location.streetAddress}&query_place_id=${selected?.locationFields.location.placeId}`}>
                    <a
                      className="font-bold text-xs text-red uppercase text-center block mt-3 underline"
                      target="_blank">
                      Get Directions
                    </a>
                  </Link>
                  <h3 className="font-bold text-xs text-red text-center mt-8">
                    Opening hours
                  </h3>
                  <p
                    className="text-black font-bold text-xs text-center leading-tight"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: selected?.locationFields.openingHours ?? '',
                    }}
                  />
                  <h3 className="font-bold text-xs text-red text-center mt-8">
                    Call us
                  </h3>
                  <Link
                    href={`tel:${selected?.locationFields.contactNumber}`}
                    passHref>
                    <a
                      className="font-bold text-xs text-black uppercase text-center block"
                      target="_blank">
                      {selected?.locationFields.contactNumber}
                    </a>
                  </Link>
                </div>
                <section className="flex flex-col w-full items-center justify-end min-h-screen-1/8 overflow-hidden">
                  {selected?.locationFields.openingSoon === false && selected?.locationFields.openingSoon2026 === false && <button
                    className="btn-sign--up hover:cursor-signup"
                    type="button"
                    onClick={() => {
                      setShowSignUpForm(true, {
                        selectedGym: `${selected?.title} (${selected?.locationFields.area})`,
                        selectedGymId: selected.id,
                      });
                    }}>
                    <div className="rounded-full uppercase text-xs pt-3 bg-red text-white w-24 h-24 -mb-16 text-center">
                      Sign Up
                    </div>
                  </button>}
                </section>
              </section>
              {selected?.locationFields.images && (
                <motion.section
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: { y: 0, opacity: 1 },
                  }}>
                  <Carousel
                    className="relative"
                    navBtnStyle={{
                      position: 'absolute',
                      top: '-3.25rem',
                      color: '#E62D2D',
                      margin: 0,
                    }}
                    leftNavBtnStyle={{
                      left: '3%',
                    }}
                    rightNavBtnStyle={{
                      right: '3%',
                    }}>
                    {selected.locationFields.images.nodes.map((image, key) => {
                      return (
                        <CarouselCard key={key}>
                          <div
                            className="w-full relative"
                            style={{
                              paddingBottom: `${100 / 1.3333}%`,
                            }}>
                            <Image
                              unoptimized
                              src={image.sourceUrl}
                              layout="fill"
                              objectFit="cover"
                              alt=""
                              className="pointer-events-none"
                            />
                          </div>
                        </CarouselCard>
                      );
                    })}
                  </Carousel>
                </motion.section>
              )}
            </motion.section>
          )}
          {!showInfo && (
            <>
              <motion.section
                variants={{
                  initial: { x: 0, opacity: 1 },
                  exit: { x: '100%', opacity: 1 },
                  enter: { x: 0, opacity: 1 },
                }}
                key="show-list">
                <header className="pointer-events-none top-0 w-full pt-12 lg:pt-32 text-center z-30">
                  <h1 className="page-title relative z-20 pt-2 pb-4 block">
                    Locations
                  </h1>
                  <motion.h2
                    variants={{
                      initial: { y: -20, opacity: 0 },
                      exit: { y: 0, opacity: 1 },
                      enter: { y: 0, opacity: 1 },
                    }}
                    className="font-bold text-lg lg:text-xl mt-4 leading-none">
                    Open to public
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
                  className="w-full max-w-2xl mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-4 flex-last-item-align-start mx-auto md:w-10/12">
                  {locationsOpenToPublic?.map(({ node: location }, key) => {
                    if (
                      location.locationFields.visibility === true ||
                      typeof location.locationFields.visibility === 'undefined'
                    ) {
                      return (
                        <Bubble
                          key={key}
                          variants={{
                            initial: { y: -20, opacity: 0 },
                            exit: { y: 0, opacity: 1 },
                            enter: { y: 0, opacity: 1 },
                          }}
                          href={location.uri}
                          clickable={location.locationFields.clickable}
                          handler={(evt) => {
                            window.dispatchEvent(new Event('resize'));
                            clickHandler(location, evt);
                          }}
                          className={`w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 ${
                            location.locationFields.openingSoon === true
                              ? 'pointer-events-none'
                              : ''
                          }`}
                          titleClassName="text-sm md:text-base"
                          imageWrapperClassName={`${
                            location.id === selected?.id
                              ? 'border-red'
                              : 'border-white'
                          } ${
                            location.locationFields.openingSoon === true
                              ? 'group-hover:border-0'
                              : ''
                          }`}
                          comingSoon={location.locationFields.openingSoon}
                          title={location.title}
                          subtitle={location.locationFields.area}
                          thumbnail={
                            location.locationFields.openingSoon2026 
                              ? '/images/map-2026.jpg' 
                              : location.featuredImage
                                ? location.featuredImage.node.sourceUrl
                                : '/images/map-no-icon.png'
                          }
                        />
                      );
                    }

                    return <></>;
                  })}
                </motion.section>
                <motion.h2
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: { y: 0, opacity: 1 },
                  }}
                  className="font-bold text-lg lg:text-xl mt-8 leading-none text-center">
                    Not available for general public
                </motion.h2>
                <motion.section
                  variants={{
                    initial: { y: -20, opacity: 0 },
                    exit: { y: 0, opacity: 1 },
                    enter: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="w-full mb-3 text-center flex flex-row flex-wrap justify-center items-start mt-4 flex-last-item-align-start mx-auto md:w-10/12">
                  {locationsNotOpenToPublic?.map(({ node: item }, key) => {
                    if (
                      item.locationFields.visibility === true ||
                      typeof item.locationFields.visibility === 'undefined'
                    ) {
                      return (
                        <motion.article
                          key={key}
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
                              unoptimized
                              objectFit="cover"
                              alt={item.title}
                            />
                            <h1 className="leading-none transition-all duration-200 mx-auto mx-au text-black font-black group-hover:opacity-80 text-sm md:text-base">
                              {item.title}
                            </h1>
                          </div>
                        </motion.article>
                      );
                    }
                    return <></>;
                  })}
                </motion.section>
              </motion.section>
              <footer className="text-xs text-black text-center justify-self-end pb-4 max-w-2/3 pt-8 mx-auto">
                <p>
                  WhatsApp or call us at <a href="tel:96882388">9688 2388</a> or
                  email <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
                </p>
                <p>
                  An initiative by{' '}
                  <a
                    href="//lienfoundation.org/"
                    target="_blank"
                    rel="noreferrer">
                    Lien Foundation
                  </a>
                </p>
              </footer>
            </>
          )}
        </AnimatePresence>
      </section>
      <motion.section
        animate={mapContainerControls}
        className="border-10 md:border-60 border-red order-2 lg:order-1 w-screen lg:w-screen-1/2 min-h-screen-1/2 lg:min-h-screen relative lg:sticky top-0">
        <MapContainer
          setMobileNavBtnStyle={setMobileNavBtnStyle}
          forceActiveInfoWindow={activeInfoWindow}
          initialCenter={markers[0].position}
          currentMapCenter={currentMapCenter}
          places={markers}
        />
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
