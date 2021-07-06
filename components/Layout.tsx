/* eslint-disable react/jsx-props-no-spreading */
import React, { MutableRefObject, RefObject } from 'react';
import Header from 'components/Header';
import { WithMobileNavProps } from './MobileNav';

interface LayoutState {
  headerRef: RefObject<HTMLElement> | null;
  showLoader: boolean;
  scrolledHeader: boolean;
  noAnimation: boolean;
}

export interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
  setScrolledHeader: (arg0: boolean, noAnimation?: boolean) => void;
  showLoader: boolean;
  setShowLoader: (arg0: boolean) => void;
  setShowMobileNav: (arg0: boolean) => void;
  appRef: React.RefObject<HTMLDivElement>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function withLayout<T extends React.Component>(
  Component: React.ComponentType<T>,
  options?: {
    mobileNavBtnStyle?: string;
    mobileNavBtnInHeader?: boolean;
  },
): React.ComponentClass<T & WithLayoutProps> {
  // compiling opts
  const opts = {
    mobileNavBtnStyle: 'text-red',
    mobileNavBtnInHeader: true,
    ...options,
  };
  return class extends React.Component<T & WithLayoutProps, LayoutState> {
    appRef: React.RefObject<HTMLDivElement>;

    constructor(props: WithLayoutProps & T) {
      super(props);
      this.setHeaderRef = this.setHeaderRef.bind(this);
      this.setScrolledHeader = this.setScrolledHeader.bind(this);
      this.appRef = React.createRef<HTMLDivElement>();

      this.state = {
        headerRef: null,
        showLoader: true,
        scrolledHeader: false,
        noAnimation: false,
      };
    }

    componentDidMount() {
      function handleResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    setScrolledHeader(scrolledHeader: boolean, noAnimation = false) {
      this.setState({ scrolledHeader, noAnimation });
    }

    setHeaderRef(headerRef: RefObject<HTMLElement>) {
      this.setState({ headerRef });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<MutableRefObject<HTMLElement> | null>(null);
    render() {
      const { headerRef, showLoader, scrolledHeader, noAnimation } = this.state;
      const { setShowLoader, setShowMobileNav } = this.props;

      return (
        <div
          id="appRef"
          ref={this.appRef}
          className="font-sans antialiased border-box">
          <Header
            {...this.props}
            mobileNavBtnInHeader={opts.mobileNavBtnInHeader}
            mobileNavBtnstyle={opts.mobileNavBtnStyle}
            noAnimation={noAnimation}
            setShowMobileNav={setShowMobileNav}
            headerRef={headerRef}
            scrolledHeader={scrolledHeader}
          />
          <Component
            {...this.props}
            appRef={this.appRef}
            setScrolledHeader={this.setScrolledHeader}
            setHeaderRef={this.setHeaderRef}
            showLoader={showLoader}
            setShowLoader={setShowLoader}
          />
        </div>
      );
    }
  };
}
