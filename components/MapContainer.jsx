import GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// eslint-disable-next-line react/no-unused-prop-types
const Marker = ({
  icon,
  title,
  id,
  className = '',
  clickHandler = () => {},
  mouseOverHandler = () => {},
  mouseOutHandler = () => {},
}) => (
  <button
    type="button"
    onMouseOver={mouseOverHandler}
    onMouseOut={mouseOutHandler}
    onFocus={mouseOverHandler}
    onBlur={mouseOutHandler}
    onClick={clickHandler}
    key={id}
    style={{
      width: icon.width,
      height: icon.height,
      transform: `translateX(-${icon.width / 2}px) translateY(-${
        icon.height / 2
      }px)`,
    }}
    className={className}>
    <Image src={icon.url} width={icon.width} height={icon.height} alt={title} unoptimized />
  </button>
);

const InfoWindow = ({ visible, title = '', id = '0', style = 'red' }) => (
  <AnimatePresence exitBeforeEnter>
    {visible && (
      <motion.div
        className={`text-center min-w-32 p-1 rounded-xl font-bold text-sm ${
          style === 'red' ? 'bg-pink text-red' : 'bg-white text-black'
        }`}
        style={{
          transform: 'translateX(-50%) translateY(calc(-100% - 1.5rem))',
        }}
        key={id}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={{
          initial: { opacity: 0 },
          enter: { opacity: 1 },
          exit: { opacity: 0 },
        }}>
        <p>{title}</p>
      </motion.div>
    )}
  </AnimatePresence>
);

const MapContainer = ({
  places,
  currentMapCenter,
  forceActiveInfoWindow = undefined,
  initialCenter = { lat: 1.339652, lng: 103.837938 },
  setMobileNavBtnStyle,
}) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState(
    forceActiveInfoWindow,
  );

  const { ref, inView, entry } = useInView({
    threshold: [0, 1],
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (window.innerWidth >= 768 && window.innerWidth <= 1024 && inView) {
      setMobileNavBtnStyle('text-white');
    } else {
      setMobileNavBtnStyle('text-red');
    }
  }, [inView, setMobileNavBtnStyle]);

  useEffect(() => {
    setActiveInfoWindow(forceActiveInfoWindow);
  }, [forceActiveInfoWindow]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  return (
    <div
      ref={ref}
      className="w-full h-screen-border-1/2-10 lg:h-screen-border-60">
      <GoogleMapReact
        defaultCenter={initialCenter}
        center={currentMapCenter}
        options={{
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: false,
          fullscreenControl: false,
        }}
        zoom={13}
        bootstrapURLKeys={{
          key: apiKey,
        }}>
        {places.map((item) => (
          <Marker
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...item}
            key={item.id}
            clickHandler={(evt) => {
              if (item.clickable && item.clickHandler) item.clickHandler(evt);
            }}
            mouseOverHandler={(evt) => {
              if (item.mouseOverHandler) item.mouseOverHandler(evt);
              if (item.title) {
                setActiveInfoWindow({
                  position: item.position,
                  title: item.title,
                  id: item.id,
                  visible: true,
                  style:
                    item.icon.url === '/images/map-icon.png' ? 'red' : 'white',
                });
              }
            }}
            mouseOutHandler={(evt) => {
              if (item.mouseOutHandler) item.mouseOutHandler(evt);
              if (item.title) {
                setActiveInfoWindow(undefined);
              }
            }}
            lat={item.position.lat}
            lng={item.position.lng}
          />
        ))}
        <InfoWindow
          lat={
            typeof activeInfoWindow !== 'undefined'
              ? activeInfoWindow.position.lat
              : 0
          }
          lng={
            typeof activeInfoWindow !== 'undefined'
              ? activeInfoWindow.position.lng
              : 0
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...activeInfoWindow}
        />
      </GoogleMapReact>
    </div>
  );
};

export default MapContainer;

// export default GoogleApiWrapper({
//   apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
// })(MapContainer);
