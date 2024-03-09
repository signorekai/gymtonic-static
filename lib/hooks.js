import { useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useActiveHeader = (setShowHeader) => {
  const scrollProgress = useRef(0);
  const handleScroll = useDebouncedCallback(
    () => {
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

export const useActiveHeaderForElement = (setShowHeader, elem) => {
  const scrollProgress = useRef(0);
  const handleScroll = useDebouncedCallback(
    () => {
      if (elem && elem.current) {
        if (
          scrollProgress.current < elem.current.scrollTop &&
          elem.current.scrollTop - scrollProgress.current >= 5
        ) {
          setShowHeader(false);
        } else if (
          scrollProgress.current > elem.current.scrollTop &&
          scrollProgress.current - elem.current.scrollTop >= 5
        ) {
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
