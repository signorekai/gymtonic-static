import React from 'react';
import {
  NextTemplateLoader,
  getNextStaticPaths,
  getNextStaticProps,
} from '@wpengine/headless/next';
import { getApolloClient } from '@wpengine/headless';
import { gql } from '@apollo/client';
import { GetStaticPropsContext } from 'next';
import WPTemplates from '../wp-templates/_loader';

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

export interface MenuData {
  // eslint-disable-next-line react/no-unused-prop-types
  map(
    arg0: ({ node }: MenuData, index: number) => JSX.Element,
  ):
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNodeArray
    | React.ReactPortal
    | null
    | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  length: number;
  // eslint-disable-next-line react/no-unused-prop-types
  node: {
    cssClasses: string;
    order: number;
    url: string;
    label: string;
    path: string;
    id: string;
  };
}

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
