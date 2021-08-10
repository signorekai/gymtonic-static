import React from 'react';
import Link from 'next/link';

interface Props {
  hideOnMobile?: boolean;
}

const AboutCard = ({ hideOnMobile = false }: Props): JSX.Element => {
  return (
    <section
      className={`order-2 lg:order-1 w-full lg:w-1/2 pt-8 md:pt-16 lg:pt-28 lg:min-h-screen flex flex-col justify-between ${
        hideOnMobile ? 'hidden lg:block' : ''
      }`}>
      <div>
        <h1 className="text-2xl md:text-2xl leading-none text-red font-black text-center mb-6 md:mb-12">
          About
        </h1>
        <h5 className="px-8 md:px-32 lg:px-20 xl:px-24 mb-6 md:mb-12 text-center text-2xl md:text-5xl leading-tighter font-black">
          Gym Tonic is known affectionately as the “Uncle Auntie Gym” – designed
          specially for our Merdeka and Pioneer Generations.
        </h5>
        <h5 className="px-8 md:px-32 lg:px-20 xl:px-22 text-center text-2xl md:text-5xl leading-tighter font-black">
          It is{' '}
          <Link href="/research" scroll={false}>
            <a className="about-link">
              <span>proven</span>
            </a>
          </Link>{' '}
          to help seniors get stronger even as they get older, through a{' '}
          <Link href="/its-simple" scroll={false}>
            <a className="about-link">
              <span>simple</span>
            </a>
          </Link>{' '}
          fitness plan,{' '}
          <Link href="/technology" scroll={false}>
            <a className="about-link">
              <span>high-tech</span>
            </a>
          </Link>{' '}
          gym equipment and coaches who{' '}
          <Link href="/coaches" scroll={false}>
            <a className="about-link">
              <span>care</span>
            </a>
          </Link>
          .
        </h5>
      </div>
      <div className="text-xs text-center justify-self-end pb-4 max-w-2/3 pt-8 mx-auto">
        <p>
          WhatsApp or call us at <a href="tel:96882388">9688 2388</a> or email{' '}
          <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
        </p>
        <p>An initiative by Lien Foundation</p>
      </div>
    </section>
  );
};

export default AboutCard;
