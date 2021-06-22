import React from 'react';
import { WPHead } from '@wpengine/headless/next';
import { gql, useQuery } from '@apollo/client';
import styles from 'scss/components/Header.module.scss';
import Link from 'next/link';
import Head from 'next/head';

interface Props {
  title?: string;
  description?: string;
}

interface MenuData {
  node: {
    cssClasses: string[];
    order: number;
    url: string;
    label: string;
    path: string;
    id: string;
  }
}

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

function Header({
  title = 'Headless by WP Engine',
  description,
}: Props): JSX.Element {
  const menu = useQuery(menuQuery);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const menuItems: MenuData = menu.data?.menu.menuItems.edges;

  return (
    <>
      <Head>
        <title>{/* Title is required here but replaced by WPHead. */}</title>
        {/* Add extra elements to <head> here. */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?display=swap&amp;family=Public%20Sans%3Aital%2Cwght%400%2C100..900%3B1%2C100..900&amp;subset=latin%2Clatin-ext"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&amp;family=Public%20Sans%3Aital%2Cwght%400%2C100..900%3B1%2C100..900&amp;subset=latin%2Clatin-ext"
          type="text/css"
          media="all"
        />
      </Head>
      <WPHead />
      <header>
        <div className={styles.wrap}>
          <div className={styles['title-wrap']}>
            <p className={styles['site-title']}>
              <Link href="/">
                <a>{title}</a>
              </Link>
            </p>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <div className={styles.menu}>
            <ul>
              {menuItems &&
                menuItems.map(({ node }) => (
                  <li key={`${node?.id}`}>
                    <Link href={node?.path}>
                      <a className={node?.cssClasses}>{node?.label}</a>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
