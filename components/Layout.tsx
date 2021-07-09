/* eslint-disable react/jsx-props-no-spreading */
import React, { RefObject } from 'react';
import Header from 'components/Header';

interface LayoutState {
  headerRef: RefObject<HTMLElement> | null;
  showLoader: boolean;
  scrolledHeader: boolean;
  noAnimation: boolean;
  mobileNavBtnStyle: string;
}

export interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
  setScrolledHeader: (arg0: boolean, noAnimation?: boolean) => void;
  setMobileNavBtnStyle: (arg0: string) => void;
  showLoader: boolean;
  setShowLoader: (arg0: boolean) => void;
  setShowMobileNav: (arg0: boolean) => void;
  appRef: React.RefObject<HTMLDivElement>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function withLayout<T extends React.Component>(
  Component: React.ComponentType<T>,
  options?: {
    mobileNavBtnInHeader?: boolean;
  },
): React.ComponentClass<T & WithLayoutProps> {
  // compiling opts
  const opts = {
    mobileNavBtnInHeader: true,
    ...options,
  };
  return class extends React.Component<T & WithLayoutProps, LayoutState> {
    appRef: React.RefObject<HTMLDivElement>;

    constructor(props: WithLayoutProps & T) {
      super(props);
      this.setHeaderRef = this.setHeaderRef.bind(this);
      this.setScrolledHeader = this.setScrolledHeader.bind(this);
      this.setMobileNavBtnStyle = this.setMobileNavBtnStyle.bind(this);
      this.appRef = React.createRef<HTMLDivElement>();

      this.state = {
        headerRef: null,
        showLoader: true,
        scrolledHeader: false,
        mobileNavBtnStyle: 'text-red',
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

    setMobileNavBtnStyle(mobileNavBtnStyle: string) {
      this.setState({ mobileNavBtnStyle });
    }

    setHeaderRef(headerRef: RefObject<HTMLElement>) {
      this.setState({ headerRef });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<RefObject<HTMLElement> | null>(null);
    render() {
      const {
        headerRef,
        showLoader,
        scrolledHeader,
        noAnimation,
        mobileNavBtnStyle,
      } = this.state;
      const { setShowLoader, setShowMobileNav } = this.props;

      return (
        <div
          id="appRef"
          ref={this.appRef}
          className="font-sans antialiased border-box">
          <Header
            {...this.props}
            mobileNavBtnInHeader={opts.mobileNavBtnInHeader}
            mobileNavBtnstyle={mobileNavBtnStyle}
            noAnimation={noAnimation}
            setShowMobileNav={setShowMobileNav}
            headerRef={headerRef}
            scrolledHeader={scrolledHeader}
          />
          <Component
            {...this.props}
            setMobileNavBtnStyle={this.setMobileNavBtnStyle}
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
