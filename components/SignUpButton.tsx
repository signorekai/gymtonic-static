/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  src: StaticImageData;
  hoverSrc: StaticImageData;
  mobileSrc: StaticImageData;
}

const SignUpBtn = ({ src, hoverSrc, mobileSrc }: Props): JSX.Element => {
  const [btnSrc, setBtnSrc] = useState(src);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBtnSrc(src);
      } else {
        setBtnSrc(mobileSrc);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileSrc, src]);

  return (
    <div className="relative w-16 h-16 md:w-24 md:h-24">
      <button
        type="button"
        onMouseOut={() => {
          setBtnSrc(window.innerWidth >= 768 ? src : mobileSrc);
        }}
        onMouseOver={() => {
          setBtnSrc(hoverSrc);
        }}>
        <Image src={btnSrc} layout="fill" alt="Sign up for GymTonic" />
      </button>
    </div>
  );
};

export default SignUpBtn;
