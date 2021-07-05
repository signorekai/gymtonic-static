import React, { RefObject, useEffect, useRef, useState } from 'react';
import { WPHead } from '@wpengine/headless/next';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// import image assets
import logo from 'assets/images/logo.png';
import { menuQuery, MenuData } from 'pages/[[...page]]';
import MobileNav from './MobileNav';

const Logo = ({ className = '' }: { className?: string }) => (
  <Link href="/">
    <div
      className={`hover:cursor-pointer pointer-events-auto ${className} relative w-20 h-20 md:w-[105px] md:h-[105px]`}>
      <Image
        loading="eager"
        src={logo}
        alt=""
        quality={100}
        layout="fill"
        sizes="(min-width: 768px) 105px, 80px"
        objectFit="contain"
        objectPosition="center center"
      />
    </div>
  </Link>
);

interface Props {
  headerRef?: RefObject<HTMLElement> | null;
  intersectionRatio?: number;
  rootMargin?: string;
  scrolledHeader: boolean;
}

function Header({
  headerRef = null,
  intersectionRatio = 0,
  rootMargin = '0px 0px 0px 0px',
  scrolledHeader,
}: Props): JSX.Element {
  const menu = useQuery(menuQuery);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const menuItems: MenuData = menu.data?.menu.menuItems.edges;
  const selfRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState<boolean>(scrolledHeader);

  const router = useRouter();

  useEffect(() => {
    setScrolled(scrolledHeader);
  }, [scrolledHeader]);

  useEffect(() => {
    let ref: HTMLElement | null = null;

    if (headerRef !== null) {
      if (headerRef?.current) ref = headerRef.current;
    } else if (selfRef.current) {
      ref = selfRef.current;
    }

    if (ref !== null) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (
            scrolled === false &&
            entry.intersectionRatio === intersectionRatio
          ) {
            setScrolled(true);
          }
        },
        {
          root: null,
          rootMargin,
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        },
      );

      observer.observe(ref);
      console.log('checking for scroll amount now');

      if (typeof window !== undefined) {
        console.log(window.scrollY, ref.clientHeight);
        if (window.scrollY >= ref.clientHeight) {
          setScrolled(true);
        }
      }

      return () => {
        observer.unobserve(ref!);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef, selfRef]);

  const isCurrent = (currentPath: string): boolean => {
    const aboutPages = ['/research', '/its-simple', '/coaches'];
    return (
      currentPath === router.asPath ||
      ((currentPath === '/about' || currentPath === '/gymtonic/about') &&
        aboutPages.indexOf(router.asPath) > -1)
    );
  };

  return (
    <>
      <Head>
        <title>{/* Title is required here but replaced by WPHead. */}</title>
        {/* Add extra elements to <head> here. */}
      </Head>
      <WPHead />
      {!scrolled && (
        <header
          className="absolute top-0 l-0 w-full z-40 text-white"
          ref={selfRef}>
          <div className="flex flex-col md:flex-row justify-center items-center mx-auto p-6 pointer-events-none">
            <ul className="flex flex-row text-center items-center antialiased pointer-events-none">
              {menuItems.map(({ node }: MenuData, index: number) => {
                return (
                  <>
                    {Math.floor(menuItems.length / 2) === index && (
                      <Logo className="mx-3" />
                    )}
                    <li
                      key={`${node.id}`}
                      className="px-4 font-black hidden xl:list-item menu-item pointer-events-auto">
                      <Link href={node.path} scroll={false}>
                        <a className="after:scale-x-0">{node.label}</a>
                      </Link>
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
        </header>
      )}
      <AnimatePresence>
        {scrolled && (
          <motion.header
            initial={{ translateY: '-100%' }}
            animate={{ translateY: 0 }}
            transition={{ duration: 0.35, ease: [0.175, 0.85, 0.42, 0.96] }}
            className="fixed top-0 l-0 w-full z-40 text-white pointer-events-none">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-start mx-auto p-6">
              <Logo />
              <ul className="flex flex-row text-center items-center antialiased">
                {menuItems.map(({ node }: MenuData) => {
                  return (
                    <li
                      key={`${node.id}`}
                      className="px-4 font-black menu-item">
                      <Link href={node.path} scroll={false}>
                        <a
                          className={`${
                            isCurrent(node.path.slice(0, -1))
                              ? 'after:scale-x-100'
                              : 'after:scale-x-0'
                          } pointer-events-auto`}>
                          {node.label}
                        </a>
                      </Link>
                    </li>
                  );
                })}
                {menuItems.length % 2 === 0 ? (
                  ''
                ) : (
                  <li className="inline-block pl-4" />
                )}
              </ul>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
