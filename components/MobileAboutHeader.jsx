import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AboutLink = ({ href, children }) => {
  const router = useRouter();

  const isCurrent = (linkHref) => {
    const sanitizedCurrentPath =
      router.asPath.split('/')[router.asPath.split('/').length - 1];
    const sanitizedLinkHref =
      linkHref.split('/')[linkHref.split('/').length - 1];
    return sanitizedCurrentPath === sanitizedLinkHref;
  };

  return (
    <Link href={href}>
      <a className={`about-link--mobile ${isCurrent(href) ? 'text-red' : ''}`}>
        {children}
      </a>
    </Link>
  );
};

const MobileAboutHeader = ({ isSticky = false }) => {
  return (
    <section
      className={`bg-white order-1 lg:hidden lg:order-1 w-full lg:w-1/2 pt-14 pb-6 mt-10 ${
        isSticky ? 'sticky z-30' : 'z-10'
      } top-0`}>
      <Link href="/about">
        <h1 className="text-2xl md:text-5xl leading-none text-red font-black text-center mb-6">
          About
        </h1>
      </Link>
      <nav className="flex flex-row justify-center px-5 md:px-32 lg:px-20 xl:px-22 text-lg md:text-2xl leading-tight md:leading-none font-black divide-solid divide-x-2">
        <AboutLink href="/research">proven</AboutLink>
        <AboutLink href="/its-simple">simple</AboutLink>
        <AboutLink href="/technology">high-tech</AboutLink>
        <AboutLink href="/coaches">care</AboutLink>
      </nav>
    </section>
  );
};

export default MobileAboutHeader;
