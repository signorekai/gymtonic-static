import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps } from '@wpengine/headless/next';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GetStaticPropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

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

  const router = useRouter();
  const { data }: QueryResult = useQuery(query);
  const locationsOpenToPublic = data?.openToPublic.locations?.edges;
  const locationsNotOpenToPublic = data?.notOpenToPublic.locations?.edges;

  const [selected, setSelected] = useState<ILocation>();

  const [currentMapCenter, setCurrentMapCenter] =
    useState<google.maps.LatLngLiteral>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => {
      setCurrentMapCenter({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      });
    });
  }, []);

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
        title: location.title,
        id: location.id,
        uri: location.uri,
        clickHandler: () => {
          if (location.locationFields.openingSoon === null) {
            void router.push(location.uri);
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
  }, [locationsOpenToPublic, locationsNotOpenToPublic, router]);

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
      <section className="lg:flex lg:min-h-screen flex-col justify-start order-3 text-red lg:order-1 w-full lg:w-1/2">
        <header className="pointer-events-none top-0 w-full pt-12 lg:pt-20 text-center z-30">
          <motion.h1 className="page-title relative z-20 pt-2 pb-4 block">
            Where to find us
          </motion.h1>
          <motion.h2
            variants={{
              initial: { y: -20, opacity: 0 },
              exit: { y: -20, opacity: 0 },
              enter: { y: 0, opacity: 1 },
            }}
            className="font-bold text-lg lg:text-xl mt-4 leading-none">
            Locations open to public
          </motion.h2>
        </header>
        <motion.section
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
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
          {locationsOpenToPublic?.map(({ node: item }) => {
            return (
              <Bubble
                handler={() => {
                  setSelected(item);
                  setCurrentMapCenter({
                    lat: item.locationFields.location.latitude,
                    lng: item.locationFields.location.longitude,
                  });
                }}
                className={`w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/3 ${
                  item.locationFields.openingSoon === true
                    ? 'pointer-events-none'
                    : ''
                }`}
                titleClassName="text-sm md:text-base"
                imageWrapperClassName={`${
                  item.id === selected?.id ? 'border-4' : 'border-0'
                } ${
                  item.locationFields.openingSoon === true
                    ? 'group-hover:border-0'
                    : ''
                }`}
                comingSoon={item.locationFields.openingSoon}
                title={item.title}
                subtitle={item.locationFields.area}
                thumbnail={
                  item.featuredImage
                    ? item.featuredImage.node.sourceUrl
                    : '/images/map-no-icon.png'
                }
              />
            );
          })}
        </motion.section>
        <motion.h2
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
            enter: { y: 0, opacity: 1 },
          }}
          className="font-bold text-lg lg:text-xl mt-8 leading-none text-center">
          By referral only
        </motion.h2>
        <motion.section
          variants={{
            initial: { y: -20, opacity: 0 },
            exit: { y: -20, opacity: 0 },
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
                  exit: { y: -20, opacity: 0 },
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
      </section>
      <section className="border-10 md:border-60 border-red order-2 lg:order-1 w-screen lg:w-screen-1/2 min-h-screen-1/2 lg:min-h-screen relative lg:sticky top-0">
        <MapContainer
          initialCenter={markers[0].position}
          currentMapCenter={currentMapCenter}
          places={markers}
        />
      </section>
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
