import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CarouselProps {
  children: JSX.Element[];
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
    <motion.article className="flex-1 h-full">
      {index === currentIndex && children}
    </motion.article>
  );
};

const Carousel: React.FunctionComponent<CarouselProps> = ({
  children,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const childrenWithProps = React.Children.map(children, (child, index) =>
    React.cloneElement(child, { index, currentIndex }),
  );

  const container = useRef<HTMLDivElement>(null);

  const goTo = (speed: number): void => {
    if (speed < 0) {
      console.log(Math.max(currentIndex + speed, 0));
      setCurrentIndex(Math.max(currentIndex + speed, 0));
    } else {
      console.log(Math.min(currentIndex + speed, children.length - 1));
      setCurrentIndex(Math.min(currentIndex + speed, children.length - 1));
    }
  };

  return (
    <div className="max-w-full h-auto overflow-hidden">
      <div className="flex flex-row items-start">
        <button
          type="button"
          className="inline-block ml-9"
          onClick={() => {
            goTo(-1);
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28">
            <g transform="translate(-1646 -2601) rotate(90)">
              <g
                transform="translate(2629 -1674) rotate(90)"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5">
                <circle cx="14" cy="14" r="14" stroke="none" />
                <circle cx="14" cy="14" r="13.25" fill="none" />
              </g>
              <path
                d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                transform="translate(5862.298 -5977.787) rotate(90)"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </button>
        <div className="flex-1 overflow-hidden" ref={container}>
          <motion.div
            variants={{
              hide: {
                opacity: 0,
                x: container.current
                  ? container.current.clientWidth * currentIndex * -1
                  : 0,
              },
              show: {
                opacity: 1,
                x: container.current
                  ? container.current.clientWidth * currentIndex * -1
                  : 0,
              },
            }}
            initial="hide"
            animate="show"
            className="flex flex-row flex-wrap"
            style={{
              width: `${children.length * 100}%`,
            }}>
            {childrenWithProps}
          </motion.div>
        </div>
        <button
          type="button"
          className="inline-block mr-9"
          onClick={() => {
            goTo(1);
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28">
            <g transform="translate(1674 2629) rotate(-90)">
              <g
                id="Ellipse_417"
                data-name="Ellipse 417"
                transform="translate(2629 -1674) rotate(90)"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5">
                <circle cx="14" cy="14" r="14" stroke="none" />
                <circle cx="14" cy="14" r="13.25" fill="none" />
              </g>
              <path
                d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                transform="translate(5862.298 -5977.787) rotate(90)"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
