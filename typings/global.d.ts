declare module '*.svg';

interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
  setScrolledHeader: (arg0: boolean, noAnimation?: boolean) => void;
  setMobileNavBtnStyle: (arg0: string) => void;
  showLoader: boolean;
  setShowLoader: (arg0: boolean) => void;
  setShowMobileNav: (arg0: boolean) => void;
  appRef: React.RefObject<HTMLDivElement>;
}

interface WithMobileNavProps {
  setShowMobileNav: (arg0: boolean) => void;
}

interface Place {
  position: {
    lat: number;
    lng: number;
  };
  icon: {
    url: string;
    width: number;
    height: number;
  };
  id: string;
  title?: string;
  uri?: string;
  className?: string;
  clickHandler?(): void;
  mouseOverHandler?(): void;
  mouseOutHandler?(): void;
}

interface MenuData {
  // eslint-disable-next-line react/no-unused-prop-types
  map(
    arg0: ({ node }: MenuData, index: number) => JSX.Element,
  ):
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNodeArray
    | React.ReactPortal
    | null
    | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  length: number;
  // eslint-disable-next-line react/no-unused-prop-types
  node: {
    cssClasses: string;
    order: number;
    url: string;
    label: string;
    path: string;
    id: string;
  };
}

interface Gym {
  id: string;
  uri: string;
  title: string;
}

interface ILocation {
  id: string;
  uri: string;
  title: string;
  locationFields: LocationFields;
  terms: {
    nodes: {
      id: string;
      name: string;
      termTaxonomyId: number;
    }[];
  };
  featuredImage?: {
    node: {
      id: string;
      sizes: string;
      sourceUrl: string;
      largeSourceUrl: string;
      mediaDetails: {
        height: number;
        width: number;
      };
    };
  };
}

interface LocationFields {
  area: string;
  contactNumber: string;
  images?: {
    sourceUrl: string;
    mediaDetails: {
      height: number;
      width: number;
    };
  };
  location: {
    city: string;
    country: string;
    countryShort: string;
    latitude: number;
    longitude: number;
    placeId: string;
    postCode: string;
    state: string;
    stateShort: string;
    streetAddress: string;
    streetName: string;
    streetNumber: string;
    zoom: string;
  };
  openingHours: string;
  openingSoon: null;
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface IActiveInfoWindow {
  position: LatLngLiteral;
  title: string;
  id: string;
  visible: boolean;
}
