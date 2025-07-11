import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BubbleLink = ({ href, children, clickHandler, clickable }) => {
  if (href && clickable === true) {
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

const Bubble = ({
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
  clickable = true,
}) => {
  const clickHandler = (evt) => {
    if (clickable) {
      handler(evt);
    }
    if (window.innerWidth < 1024) {
      window.scrollTo({ left: 0, top: 0 });
    }
  };

  return (
    <article
      id={id}
      className={`bubble px-4 pb-8 md:pb-12 flex flex-col justify-center md:justify-start group z-20 relative ${className} ${clickable === false && 'pointer-events-none'}`}>
      <BubbleLink href={href} clickHandler={clickHandler} clickable={clickable}>
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
