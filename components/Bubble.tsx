import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variant } from 'framer-motion';

interface BubbleProps {
  id?: string;
  thumbnail: string;
  href?: string;
  handler(evt: Event): void;
  subtitle: string;
  title: string;
  borderColor?: 'white' | 'pink' | 'red';
  className?: string;
  imageWrapperClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
  comingSoon?: boolean | null;
  variants?: {
    initial?: Variant;
    exit?: Variant;
    enter?: Variant;
  };
}

interface BubbleLinkProp {
  href: string | undefined;
  children: React.ReactNode;
  clickHandler(evt: any): void;
}

const BubbleLink: React.FunctionComponent<BubbleLinkProp> = ({
  href,
  children,
  clickHandler,
}: BubbleLinkProp) => {
  if (href) {
    return (
      <Link href={href}>
        <a
          className="bubble__link"
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          onKeyPress={clickHandler}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <a
      className="bubble__link"
      role="button"
      tabIndex={0}
      onClick={clickHandler}
      onKeyPress={clickHandler}>
      {children}
    </a>
  );
};

const Bubble: React.FunctionComponent<BubbleProps> = ({
  id = '',
  thumbnail,
  handler,
  href,
  subtitle,
  title,
  borderColor = 'white',
  className = '',
  imageWrapperClassName = '',
  titleClassName = 'text-base',
  subTitleClassName = 'text-xs',
  variants = {},
  comingSoon = false,
}: BubbleProps) => {
  const clickHandler = (evt: any): void => {
    handler(evt);
    if (window.innerWidth < 1024) {
      window.scrollTo({ left: 0, top: 0 });
    }
  };

  const articleVariants = {
    initial: { y: -20, opacity: 0 },
    exit: { y: -20, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    ...variants,
  };

  return (
    <article
      id={id}
      className={`bubble px-4 pb-8 md:pb-12 flex flex-col justify-center md:justify-start group z-20 relative ${className}`}>
      <BubbleLink href={href} clickHandler={clickHandler}>
        {thumbnail && (
          <div
            className={`overflow-hidden bg-transparent border-box relative rounded-full w-screen-2/5 h-screen-w-2/5 md:w-36 md:h-36 mb-3 mx-auto border-${borderColor} hover:border-red border-4 transition-all !content-box bubble__image-wrapper ${imageWrapperClassName}`}>
            <Image
              src={thumbnail}
              unoptimized
              layout="fill"
              quality={90}
              sizes="320px"
              placeholder="blur"
              blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUkpA4CAABqwENo/rLPQAAAABJRU5ErkJggg=="
              objectFit="cover"
              alt={title}
            />
            {comingSoon && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full uppercase text-xs pt-3 bg-red text-white w-24 h-24 -mb-12 text-center">
                Opening
                <br />
                Soon
              </div>
            )}
          </div>
        )}
        <h6
          className={`text-red uppercase leading-none group-hover:opacity-80 mb-2 bubble__subtitle ${subTitleClassName}`}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        <h1
          className={`leading-tighter transition-all duration-200 mx-auto mx-au text-black bubble__title font-black group-hover:opacity-80 ${titleClassName}`}>
          {title}
        </h1>
      </BubbleLink>
    </article>
  );
};

export default Bubble;
