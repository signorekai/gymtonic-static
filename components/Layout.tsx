/* eslint-disable react/jsx-props-no-spreading */
import React, { MutableRefObject, RefObject } from 'react';
import Header from 'components/Header';
import { WithMobileNavProps } from './MobileNav';

interface LayoutState {
  headerRef: RefObject<HTMLElement> | null;
  showLoader: boolean;
  scrolledHeader: boolean;
}

export interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
  setScrolledHeader: (arg0: boolean) => void;
  showLoader: boolean;
  setShowLoader: (arg0: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function withLayout<T extends React.Component>(
  Component: React.ComponentType<T>,
): React.ComponentClass<T & WithLayoutProps> {
  return class extends React.Component<T & WithLayoutProps, LayoutState> {
    constructor(props: WithLayoutProps & T) {
      super(props);
      this.setHeaderRef = this.setHeaderRef.bind(this);
      this.setShowLoader = this.setShowLoader.bind(this);
      this.setScrolledHeader = this.setScrolledHeader.bind(this);
      this.state = {
        headerRef: null,
        showLoader: true,
        scrolledHeader: false,
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

    setScrolledHeader(scrolledHeader: boolean) {
      this.setState({ scrolledHeader });
    }

    setHeaderRef(headerRef: RefObject<HTMLElement>) {
      this.setState({ headerRef });
    }

    setShowLoader(showLoader: boolean) {
      this.setState({ showLoader });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<MutableRefObject<HTMLElement> | null>(null);
    render() {
      const { headerRef, showLoader, scrolledHeader } = this.state;

      return (
        <div className="font-sans antialiased border-box">
          <Header
            {...this.props}
            headerRef={headerRef}
            scrolledHeader={scrolledHeader}
          />
          <Component
            {...this.props}
            setScrolledHeader={this.setScrolledHeader}
            setHeaderRef={this.setHeaderRef}
            showLoader={showLoader}
            setShowLoader={this.setShowLoader}
          />
        </div>
      );
    }
  };
}
