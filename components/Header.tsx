import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WPHead } from '@wpengine/headless/next';
import { gql, useQuery } from '@apollo/client';
import styles from 'scss/components/Header.module.scss';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// import image assets
import logo from '../assets/images/logo.png';

interface Props {
  title?: string;
  description?: string;
}

interface MenuData {
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

  // IntersectionObserver
  const headerRef = useRef<HTMLElement>(null);
  const options = useMemo(
    () => ({
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: [0],
    }),
    [],
  );

  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (headerRef.current) {
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (scrolled === false && entry.intersectionRatio === 0) {
          setScrolled(true);
        }
      }, options);

      observer.observe(headerRef.current);

      const headerElem: HTMLElement = headerRef.current;
      return () => {
        observer.unobserve(headerElem);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef, options]);

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
      <header
        className={
          scrolled
            ? 'fixed animate-menu-drop-down top-0 l-0 w-full z-40 text-white'
            : 'absolute top-0 l-0 w-full z-40 text-white'
        }
        ref={headerRef}>
        <div
          className={
            scrolled
              ? 'flex flex-col md:flex-row justify-center md:justify-between items-start mx-auto p-6'
              : 'flex flex-col md:flex-row justify-center md:justify-center items-center mx-auto p-6'
          }>
          {scrolled ? (
            <Link href="/">
              <Image
                src={logo}
                alt=""
                width={105}
                height={105}
                quality={100}
                placeholder="blur"
              />
            </Link>
          ) : (
            <></>
          )}
          <div className="text-center">
            <ul className="flex flex-row items-center antialiased">
              {menuItems.map(({ node }: MenuData, index: number) => {
                return (
                  <>
                    {Math.floor(menuItems.length / 2) === index &&
                    scrolled === false ? (
                      <Link href="/">
                        <a>
                          <Image
                            src={logo}
                            alt=""
                            width={105}
                            height={105}
                            quality={100}
                            placeholder="blur"
                          />
                        </a>
                      </Link>
                    ) : (
                      ''
                    )}
                    <li key={`${node.id}`} className="px-4 font-black">
                      <Link href={node.path}>{node.label}</Link>
                    </li>
                  </>
                );
              })}
              {menuItems.length % 2 === 0 ? (
                ''
              ) : (
                <li className="inline-block pl-4" />
              )}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
