import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AboutLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const isCurrent = (linkHref: string): boolean => {
    const aboutPages = ['research', 'its-simple', 'coaches'];
    const sanitizedCurrentPath =
      router.asPath.split('/')[router.asPath.split('/').length - 1];
    const sanitizedLinkHref =
      linkHref.split('/')[linkHref.split('/').length - 1];
    return sanitizedCurrentPath === sanitizedLinkHref;
  };

  return (
    <Link href={href} scroll={false}>
      <a className={`about-link--mobile ${isCurrent(href) ? 'text-red' : ''}`}>
        {children}
      </a>
    </Link>
  );
};

const MobileAboutHeader = ({
  isSticky = false,
}: {
  isSticky?: boolean;
}): JSX.Element => {
  return (
    <section
      className={`bg-white order-1 lg:hidden lg:order-1 w-full lg:w-1/2 pt-16 pb-8 mt-8 z-10 ${
        isSticky ? 'sticky' : ''
      } top-0`}>
      <h1 className="text-2xl md:text-5xl leading-none text-red font-black text-center mb-6">
        About
      </h1>
      <h5 className="px-8 md:px-32 lg:px-20 xl:px-22 text-center text-lg md:text-2xl leading-tight md:leading-none font-black divide-solid divide-x-2">
        <AboutLink href="/research">proven</AboutLink>
        <AboutLink href="/its-simple">simple</AboutLink>
        <AboutLink href="/about-high-tech">high-tech</AboutLink>
        <AboutLink href="/coaches">care</AboutLink>
      </h5>
    </section>
  );
};

export default MobileAboutHeader;
