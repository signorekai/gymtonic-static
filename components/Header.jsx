import React, { useEffect, useRef, useState } from 'react';
import { WPHead } from '@wpengine/headless/next';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

// import image assets
import logo from '../assets/images/logo.png';
import { menuQuery } from '../pages/[[...page]]';
import MobileNavBtn from '../components/MobileNavBtn';

const Logo = ({ className = '' }) => (
  <Link href="/">
    <a className="pointer-events-auto relative z-40">
      <div
        className={`hover:cursor-generic pointer-events-auto ${className} relative w-18 h-18 md:w-[105px] md:h-[105px]`}>
        <Image
          loading="eager"
          unoptimized
          src={logo}
          alt=""
          quality={100}
          layout="fill"
          sizes="(min-width: 768px) 105px, 80px"
          objectFit="contain"
          objectPosition="center center"
        />
      </div>
    </a>
  </Link>
);

function Header({
  headerRef = null,
  intersectionRatio = 0,
  rootMargin = '0px 0px 0px 0px',
  scrolledHeader,
  noAnimation = false,
  setShowMobileNav,
  mobileNavBtnstyle,
  mobileNavBtnInHeader,
  showHeader = true,
}) {
  const menu = useQuery(menuQuery);
  const menuItems = menu.data?.menu.menuItems.edges;
  const selfRef = useRef(null);
  const [scrolled, setScrolled] = useState(scrolledHeader);

  const router = useRouter();

  useEffect(() => {
    setScrolled(scrolledHeader);
  }, [scrolledHeader]);

  useEffect(() => {
    let ref = null;

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

      if (typeof window !== undefined) {
        if (window.scrollY >= ref.clientHeight) {
          setScrolled(true);
        }
      }

      return () => {
        observer.unobserve(ref);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerRef, selfRef]);

  const isCurrent = (currentPath) => {
    const aboutPages = ['/research', '/its-simple', '/coaches', '/technology'];
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
      <AnimatePresence>
        {!scrolled && (
          <motion.header
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { y: '-100%' },
              animate: (custom) => ({
                y: custom.showHeader ? 0 : '-100%',
              }),
            }}
            custom={{ showHeader }}
            className="fixed top-0 l-0 w-full z-30 text-white"
            ref={selfRef}>
            <div className="flex flex-col md:flex-row justify-center items-center mx-auto p-10 pointer-events-none">
              <ul className="flex flex-row text-center items-center antialiased pointer-events-none">
                {menuItems.map(({ node }, index) => {
                  return (
                    <>
                      {Math.floor(menuItems.length / 2) === index && (
                        <Logo className="mx-3" />
                      )}
                      <li
                        key={`${node.id}`}
                        className="px-4 font-black hidden lg:list-item xl:list-item menu-item pointer-events-auto">
                        <Link href={node.path}>
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
          </motion.header>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {scrolled && (
          <motion.header
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { y: '-100%' },
              animate: (custom) => ({
                y: custom.showHeader ? 0 : '-100%',
              }),
            }}
            custom={{ showHeader }}
            className="fixed top-0 l-0 w-full z-40 text-white pointer-events-none">
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-start mx-auto p-4 md:py-6 md:px-12">
              <Logo />
              <ul className="flex flex-row text-center items-center antialiased">
                {menuItems.map(({ node }) => {
                  return (
                    <li
                      key={`${node.id}`}
                      className="px-4 font-black menu-item">
                      <Link href={node.path}>
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
              {mobileNavBtnInHeader && (
                <div className="absolute pointer-events-auto top-6 leading-0 md:-translate-y-1/2 right-4 md:top-10 md:right-7 z-40">
                  <MobileNavBtn
                    setShowMobileNav={setShowMobileNav}
                    barStyle={mobileNavBtnstyle}
                  />
                </div>
              )}
            </div>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
