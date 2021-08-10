/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  src: StaticImageData;
  hoverSrc: StaticImageData;
  mobileSrc: StaticImageData;
  setShowSignUpForm: (arg0: boolean) => void;
}

const SignUpBtn = ({
  src,
  hoverSrc,
  mobileSrc,
  setShowSignUpForm,
}: Props): JSX.Element => {
  const [btnStyle, setBtnStyle] = useState<'default' | 'hover' | 'mobile'>(
    'default',
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBtnStyle('default');
      } else {
        setBtnStyle('mobile');
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileSrc, src]);

  return (
    <div className="relative sign-up-btn w-16 h-16 md:w-24 md:h-24 rounded-full">
      <button
        type="button"
        onMouseOut={() => {
          setBtnStyle(window.innerWidth >= 768 ? 'default' : 'mobile');
        }}
        onMouseOver={() => {
          setBtnStyle('hover');
        }}
        onMouseDown={() => {
          setShowSignUpForm(true);
        }}
        className="hover:cursor-signup w-full h-full">
        <div className={`${btnStyle !== 'default' ? 'hidden' : ''}`}>
          <Image
            unoptimized
            src={src}
            layout="fill"
            alt="Sign up for GymTonic"
          />
        </div>
        <div className={`${btnStyle !== 'mobile' ? 'hidden' : ''}`}>
          <Image
            unoptimized
            src={mobileSrc}
            layout="fill"
            alt="Sign up for GymTonic"
          />
        </div>
        <div className={`${btnStyle !== 'hover' ? 'hidden' : ''}`}>
          <Image
            unoptimized
            src={hoverSrc}
            layout="fill"
            alt="Sign up for GymTonic"
          />
        </div>
      </button>
    </div>
  );
};

export default SignUpBtn;
