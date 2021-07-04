import React from 'react';
import Link from 'next/link';

interface Props {
  hideOnMobile?: boolean;
}

const AboutCard = ({ hideOnMobile = false }: Props): JSX.Element => {
  return (
    <section
      className={`order-2 lg:order-1 w-full lg:w-1/2 py-8 md:py-16 lg:py-28 ${
        hideOnMobile ? 'hidden lg:block' : ''
      }`}>
      <h1 className="text-2xl md:text-2xl leading-none text-red font-black text-center mb-6 md:mb-12">
        About
      </h1>
      <h5 className="px-8 md:px-32 lg:px-20 xl:px-24 mb-6 md:mb-12 text-center text-2xl md:text-5xl leading-tight md:leading-none font-black">
        Gym Tonic is known affectionately as the “Uncle Auntie Gym” – designed
        specially for our Merdeka and Pioneer Generations.
      </h5>
      <h5 className="px-8 md:px-32 lg:px-20 xl:px-22 text-center text-2xl md:text-5xl leading-tight md:leading-none font-black">
        It is{' '}
        <Link href="/about-proven" scroll={false}>
          <a className="about-link">proven</a>
        </Link>{' '}
        to help seniors get stronger even as they get older, through a{' '}
        <Link href="/about-simple" scroll={false}>
          <a className="about-link">simple</a>
        </Link>{' '}
        fitness plan,{' '}
        <Link href="/about-high-tech" scroll={false}>
          <a className="about-link">high-tech</a>
        </Link>{' '}
        gym equipment and coaches who{' '}
        <Link href="/about-care" scroll={false}>
          <a className="about-link">care</a>
        </Link>
        .
      </h5>
    </section>
  );
};

export default AboutCard;