import GoogleMapReact from 'google-map-react';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MarkerProps extends Place {
  // eslint-disable-next-line react/no-unused-prop-types
  lat: number;
  // eslint-disable-next-line react/no-unused-prop-types
  lng: number;
}

// eslint-disable-next-line react/no-unused-prop-types
const Marker = ({
  icon,
  title,
  id,
  clickHandler = () => {},
  mouseOverHandler = () => {},
  mouseOutHandler = () => {},
}: MarkerProps): JSX.Element => (
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
    }}>
    <Image src={icon.url} width={icon.width} height={icon.height} alt={title} />
  </button>
);

interface InfoWindowProps {
  visible?: boolean;
  title?: string;
  id?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  lat: number;
  // eslint-disable-next-line react/no-unused-prop-types
  lng: number;
}

const InfoWindow = ({
  visible,
  title = '',
  id = '0',
}: InfoWindowProps): JSX.Element => (
  <AnimatePresence exitBeforeEnter>
    {visible && (
      <motion.div
        className="text-center min-w-52 bg-pink p-2 rounded-xl text-red font-bold text-sm"
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

interface Props {
  currentMapCenter?: LatLngLiteral;
  places: Place[];
  initialCenter?: LatLngLiteral;
}

const MapContainer = ({
  places,
  currentMapCenter,
  initialCenter = { lat: 1.339652, lng: 103.837938 },
}: Props): JSX.Element => {
  const [activeInfoWindow, setActiveInfoWindow] = useState<{
    position: LatLngLiteral;
    title: string;
    id: string;
    visible: boolean;
  }>();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

  return (
    <div className="w-full h-screen-border-1/2-10 lg:h-screen-border-60">
      <GoogleMapReact
        defaultCenter={initialCenter}
        center={currentMapCenter}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
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
            clickHandler={() => {
              if (item.clickHandler) item.clickHandler();
            }}
            mouseOverHandler={() => {
              if (item.mouseOverHandler) item.mouseOverHandler();
              if (item.title) {
                setActiveInfoWindow({
                  position: item.position,
                  title: item.title,
                  id: item.id,
                  visible: true,
                });
              }
            }}
            mouseOutHandler={() => {
              if (item.mouseOutHandler) item.mouseOutHandler();
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
// export default GoogleApiWrapper({
//   apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
// })(MapContainer);
