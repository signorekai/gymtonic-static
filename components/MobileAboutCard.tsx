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

  const checkCurrent = (route: string): boolean => {
    return route === router.asPath;
  };

  return (
    <Link href={href} scroll={false}>
      <a
        className={`about-link--mobile ${
          checkCurrent(href) ? 'text-red' : ''
        }`}>
        {children}
      </a>
    </Link>
  );
};

const MobileAboutCard = (): JSX.Element => {
  return (
    <section className="order-1 lg:hidden lg:order-1 w-full lg:w-1/2 py-8 md:py-16 lg:py-28 pt-22">
      <h1 className="text-2xl md:text-2xl leading-none text-red font-black text-center mb-6 md:mb-12">
        About
      </h1>
      <h5 className="px-8 md:px-32 lg:px-20 xl:px-22 text-center text-lg md:text-2xl leading-tight md:leading-none font-black divide-solid divide-x-2">
        <AboutLink href="/about-proven">proven</AboutLink>
        <AboutLink href="/about-simple">simple</AboutLink>
        <AboutLink href="/about-high-tech">high-tech</AboutLink>
        <AboutLink href="/about-care">care</AboutLink>
      </h5>
    </section>
  );
};

export default MobileAboutCard;
