import {
  GoogleApiWrapper,
  Map,
  InfoWindow,
  Marker,
  GoogleAPI,
} from 'google-maps-react';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  currentMapCenter?: google.maps.LatLngLiteral;
  google: GoogleAPI;
  places: {
    position: {
      lat: number;
      lng: number;
    };
    icon: google.maps.Icon;
    id: string;
    title: string;
    uri: string;
  }[];
  markerClickHandler(arg0: google.maps.LatLngLiteral): void;
  markerMouseOverHandler(arg0: google.maps.LatLngLiteral): void;
}

const MapContainer = ({
  places,
  google,
  currentMapCenter,
  markerMouseOverHandler,
  markerClickHandler,
}: Props) => {
  const [activeMarker, setActiveMarker] = useState<google.maps.Marker>();

  const markerHandler = (marker: google.maps.Marker) => {
    setActiveMarker(marker);
  };

  return (
    <Map
      containerStyle={{ width: '100%', height: '100%' }}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      google={google}
      initialCenter={places[0].position || { lat: 1.339652, lng: 103.837938 }}
      center={currentMapCenter}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      zoom={14}>
      {places.map((item) => (
        <Marker
          onMouseover={(prop, marker) => {
            if (marker && prop && typeof prop.position !== 'undefined') {
              markerHandler(marker);
              markerMouseOverHandler(prop.position);
            }
          }}
          onClick={(prop, marker) => {
            if (marker && prop && typeof prop.position !== 'undefined') {
              markerHandler(marker);
              markerClickHandler(prop.position);
            }
          }}
          position={item.position}
          name={item.title}
          title={item.title}
          icon={item.icon}
        />
      ))}
      <InfoWindow
        marker={activeMarker}
        visible={typeof activeMarker !== 'undefined'}>
        <h1>{activeMarker?.getTitle()}</h1>
      </InfoWindow>
    </Map>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
})(MapContainer);
