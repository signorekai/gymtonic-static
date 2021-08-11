import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, PanInfo, useAnimation } from 'framer-motion';

interface CarouselProps {
  children: JSX.Element[];
  className?: string;
  isDraggable?: boolean;
  showNav?: boolean;
  navBtnStyle?: React.CSSProperties;
  leftNavBtnStyle?: React.CSSProperties;
  rightNavBtnStyle?: React.CSSProperties;
  navBtnPosition?: 'top' | 'center';
}

interface CarouselCardProps {
  children: React.ReactNode;
  index?: number;
  currentIndex?: number;
}

export const CarouselCard: React.FunctionComponent<CarouselCardProps> = ({
  children,
  index,
  currentIndex,
}: CarouselCardProps) => {
  return (
    <motion.article
      variants={{ show: { opacity: 1 }, hide: { opacity: 1 } }}
      className="flex-1 h-full px-0">
      <AnimatePresence exitBeforeEnter>
        {index === currentIndex && children}
      </AnimatePresence>
    </motion.article>
  );
};

const Carousel: React.FunctionComponent<CarouselProps> = ({
  children,
  showNav = true,
  className = '',
  isDraggable = true,
  navBtnPosition = 'top',
  navBtnStyle = {},
  rightNavBtnStyle = {},
  leftNavBtnStyle = {},
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(children.length * 3);
  const [slideWidth, setSlideWidth] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const slidesContainer = useRef<HTMLDivElement>(null);
  const carouselAnimationControls = useAnimation();

  const infiniteChildren = [
    ...children,
    ...children,
    ...children,
    ...children,
    ...children,
    ...children,
    ...children,
  ];

  const fullNavBtnStyle = {
    display: 'inline-block',
    ...navBtnStyle,
  };

  const goTo = (speed: number): void => {
    if (speed < 0) {
      setCurrentIndex(Math.max(currentIndex + speed, 0));
    } else if (speed > 0) {
      setCurrentIndex(
        Math.min(currentIndex + speed, infiniteChildren.length - 1),
      );
    }
  };

  const handleDrag = (
    evt: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (container.current) {
      if (
        info.point.x !== 0 &&
        info.point.y !== 0 &&
        Math.abs(info.offset.x) > container.current.clientWidth * 0.2
      ) {
        setTimeout(() => {
          goTo(info.offset.x < 0 ? 1 : -1);
        }, 100);
      } else {
        void carouselAnimationControls.start('show');
      }
    }
  };

  useEffect(() => {
    void carouselAnimationControls.start('show');
  }, [carouselAnimationControls, currentIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (slidesContainer.current) {
        setSlideWidth(slidesContainer.current.clientWidth);
      }
    };

    if (slidesContainer.current) {
      setSlideWidth(slidesContainer.current.clientWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [slidesContainer, carouselAnimationControls]);

  const childrenWithProps = React.Children.map(
    infiniteChildren,
    (child, index) =>
      // eslint-disable-next-line react/no-array-index-key
      React.cloneElement(child, { index, currentIndex }),
  );

  return (
    <div className={`max-w-full h-auto relative ${className}`}>
      <div
        className={`flex flex-row h-full ${
          navBtnPosition === 'top' ? 'items-start' : 'items-center'
        }`}>
        {showNav && (
          <button
            type="button"
            className={`inline-block ml-2 md:ml-9 transition-opacity duration-200 text-white ${
              currentIndex === 0 ? 'opacity-50 hover:cursor-not-allowed' : ''
            }`}
            style={{ ...fullNavBtnStyle, ...leftNavBtnStyle }}
            onClick={() => {
              goTo(-1);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28">
              <g
                transform="translate(-1646 -2601) rotate(90)"
                className="stroke-current">
                <g
                  transform="translate(2629 -1674) rotate(90)"
                  fill="none"
                  strokeWidth="1.5">
                  <circle cx="14" cy="14" r="14" stroke="none" />
                  <circle cx="14" cy="14" r="13.25" fill="none" />
                </g>
                <path
                  d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                  transform="translate(5862.298 -5977.787) rotate(90)"
                  fill="none"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          </button>
        )}
        <div className="flex-1 h-full overflow-hidden" ref={container}>
          <motion.div
            ref={slidesContainer}
            drag={isDraggable ? 'x' : false}
            dragConstraints={container}
            dragMomentum={false}
            onDragEnd={handleDrag}
            variants={{
              hide: {
                x: `0%`,
              },
              show: (custom: {
                currentIndex: number;
                childrenCount: number;
              }) => {
                const width = slidesContainer.current?.clientWidth || 0;

                return {
                  x: (custom.currentIndex / custom.childrenCount) * width * -1,
                  transition: {
                    duration: 0.2,
                  },
                };
              },
            }}
            custom={{
              currentIndex,
              childrenCount: infiniteChildren.length,
            }}
            initial="hide"
            animate={carouselAnimationControls}
            exit="hide"
            className={`flex flex-row flex-wrap md:px-0 ${
              isDraggable ? 'md:cursor-move' : ''
            }`}
            style={{
              width: `${infiniteChildren.length * 100}%`,
            }}>
            {childrenWithProps}
          </motion.div>
        </div>
        {showNav && (
          <button
            type="button"
            className={`inline-block mr-2 md:mr-9 transition-opacity duration-200 ${
              currentIndex === infiniteChildren.length - 1
                ? 'opacity-50 hover:cursor-not-allowed'
                : ''
            }`}
            style={{ ...fullNavBtnStyle, ...rightNavBtnStyle }}
            onClick={() => {
              goTo(1);
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28">
              <g
                transform="translate(1674 2629) rotate(-90)"
                className="stroke-current">
                <g
                  id="Ellipse_417"
                  data-name="Ellipse 417"
                  transform="translate(2629 -1674) rotate(90)"
                  fill="none"
                  strokeWidth="1.5">
                  <circle cx="14" cy="14" r="14" stroke="none" />
                  <circle cx="14" cy="14" r="13.25" fill="none" />
                </g>
                <path
                  d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                  transform="translate(5862.298 -5977.787) rotate(90)"
                  fill="none"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Carousel;
