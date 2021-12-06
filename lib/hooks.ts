import React, { useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useActiveHeader = (setShowHeader: (arg0: boolean) => void) => {
  const scrollProgress = useRef(0);
  const handleScroll = useDebouncedCallback(
    () => {
      console.log('handleScroll', scrollProgress.current, window.scrollY);
      if (scrollProgress.current < window.scrollY) {
        setShowHeader(false);
      } else if (scrollProgress.current > window.scrollY) {
        setShowHeader(true);
      }

      scrollProgress.current = window.scrollY;
    },
    300,
    { leading: true },
  );

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useActiveHeaderForElement = (
  setShowHeader: (arg0: boolean) => void,
  elem: React.MutableRefObject<HTMLElement | null>,
) => {
  const scrollProgress = useRef(0);
  const handleScroll = useDebouncedCallback(
    () => {
      console.log(36);
      if (elem && elem.current) {
        if (scrollProgress.current < elem.current.scrollTop) {
          setShowHeader(false);
        } else if (scrollProgress.current > elem.current.scrollTop) {
          setShowHeader(true);
        }
        scrollProgress.current = elem?.current.scrollTop || 0;
      }
    },
    300,
    { leading: true },
  );

  if (elem?.current) {
    elem.current.addEventListener('scroll', handleScroll);
  }

  return () => {
    if (elem?.current) {
      elem.current.removeEventListener('scroll', handleScroll);
    }
  };
};
