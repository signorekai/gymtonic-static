import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  hideOnMobile?: boolean;
}

const AboutCard = ({ hideOnMobile = false }: Props): JSX.Element => {
  return (
    <section
      className={`order-2 lg:order-1 w-full lg:w-1/2 pt-8 md:pt-16 lg:pt-28 lg:min-h-screen flex flex-col justify-between ${
        hideOnMobile ? 'hidden lg:block' : ''
      }`}>
      <div className="w-full max-w-xl xl:max-w-2xl px-8 md:px-4 lg:px-2 xl:px-8 mx-auto">
        <h1 className="text-2xl leading-none text-red font-black text-center mb-6 md:mb-12">
          About
        </h1>
        <h5 className="mb-6 md:mb-12 text-center text-2xl md:text-5xl leading-tighter font-black">
          Gym Tonic is known affectionately as the “Uncle Auntie Gym” – designed
          specially for our Pioneer and Merdeka Generations.
        </h5>
        <h5 className="text-center text-2xl md:text-5xl leading-tighter font-black">
          It is{' '}
          <Link href="/research" scroll={false}>
            <a className="about-link">
              <span>proven</span>
            </a>
          </Link>{' '}
          to help seniors get stronger even as they get
          <span className="float-left align-top -mr-2 lg:-mr-4 translate-x-0 md:translate-x-8 lg:translate-x-12 leading-0">
            <Image
              src="/images/steps.gif"
              width={window.innerWidth < 768 ? 24.5 : 41}
              height={window.innerWidth < 768 ? 52 : 87}
              alt=""
            />
          </span>{' '}
          older, through a{' '}
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
          </Link>
          <Image
            src="/images/screen.png"
            width={window.innerWidth < 768 ? 53 : 85}
            height={window.innerWidth < 768 ? 25 : 40}
            alt=""
          />{' '}
          equipment and coaches{' '}
          <span className="align-top">
            <Image
              src="/images/coach-animated.gif"
              width={window.innerWidth < 768 ? 40 : 70}
              height={window.innerWidth < 768 ? 73.5 : 128.625}
              alt=""
            />
          </span>{' '}
          who{' '}
          <Link href="/coaches" scroll={false}>
            <a className="about-link">
              <span>care</span>
            </a>
          </Link>
          .
        </h5>
      </div>
      <footer className="text-xs text-center justify-self-end pb-4 max-w-2/3 pt-8 pb-8 mx-auto">
        <p>
          WhatsApp or call us at <a href="tel:96882388">9688 2388</a> or email{' '}
          <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
        </p>
        <p>
          An initiative by{' '}
          <a href="//lienfoundation.org/" target="_blank" rel="noreferrer">
            Lien Foundation
          </a>
        </p>
      </footer>
    </section>
  );
};

export default AboutCard;
