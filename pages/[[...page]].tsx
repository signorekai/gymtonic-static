import React from 'react';
import {
  NextTemplateLoader,
  getNextStaticPaths,
  getNextStaticProps,
} from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';
import { gql, useQuery } from '@apollo/client';
import { GetStaticPropsContext } from 'next';
import WPTemplates from '../wp-templates/_loader';

const menuQuery = gql`
  {
    menu(id: "dGVybToy") {
      id
      menuItems {
        edges {
          cursor
          node {
            cssClasses
            order
            url
            label
            path
            id
          }
        }
      }
    }
  }
`;

/**
 * @todo make conditionalTags available
 */
export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <NextTemplateLoader templates={WPTemplates} />;
}


export async function getStaticProps(context: GetStaticPropsContext) {
  const client = getApolloClient(context);
  await client.query({
    query: menuQuery,
  });
  return getNextStaticProps(context, {
    templates: WPTemplates,
  });
}

export function getStaticPaths() {
  return getNextStaticPaths();
}
