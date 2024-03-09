import React from 'react';
import {
  NextTemplateLoader,
  getNextStaticPaths,
  getNextStaticProps,
} from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';
import { gql } from '@apollo/client';
import WPTemplates from '../../wp-templates/_templates';

export const menuQuery = gql`
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
  return <NextTemplateLoader templates={WPTemplates} />;
}

export async function getStaticProps(context) {
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
