import { gql, useQuery } from '@apollo/client';
import { getApolloClient } from '@wpengine/headless';
import { getNextStaticProps, useUriInfo } from '@wpengine/headless/next';
import withLayout from 'components/Layout';
import withLoader from 'components/Loader';
import withMobileNav from 'components/MobileNav';
import { GetStaticPropsContext } from 'next';
import React, { useEffect } from 'react';

const Page: React.FunctionComponent<any> = (props: WithLayoutProps) => {
  const { setScrolledHeader, setShowLoader } = props;
  const uriInfo = useUriInfo();

  const { data }: { data: { locationBy: ILocation } | undefined } =
    useQuery(gql`
      {
        locationBy(slug: "/${uriInfo?.uriPath}") {
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
  `);

  useEffect(() => {
    setShowLoader(false);
    setScrolledHeader(true, true);
  }, [setScrolledHeader, setShowLoader]);

  console.log(data, uriInfo);

  return <div>Hi</div>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps(context: GetStaticPropsContext) {
  const client = getApolloClient(context);
  let location = '/';
  if (
    context &&
    typeof context.params !== 'undefined' &&
    Array.isArray(context.params?.page)
  ) {
    location += context.params?.page.join('/');
  }

  await client.query({
    query: gql`
      {
        locationBy(slug: "${location}") {
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
    `,
  });
  return getNextStaticProps(context);
}

export default withLoader(withMobileNav(withLayout(Page)));
