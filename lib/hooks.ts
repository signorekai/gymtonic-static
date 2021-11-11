import { useRef } from 'react';
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
