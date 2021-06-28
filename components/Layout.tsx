/* eslint-disable react/jsx-props-no-spreading */
import React, { MutableRefObject, RefObject } from 'react';
import { Header } from 'components';

interface LayoutState {
  headerRef: RefObject<HTMLElement> | null;
  showLoader: boolean;
}

export interface WithLayoutProps {
  setHeaderRef: (ref: RefObject<HTMLElement>) => void;
  showLoader: boolean;
  setShowLoader: (arg0: boolean) => void;
}

export default function withLayout(
  Component: React.ComponentType<WithLayoutProps>,
): React.ComponentClass<WithLayoutProps> {
  return class extends React.Component<WithLayoutProps, LayoutState> {
    constructor(props: WithLayoutProps) {
      super(props);
      this.setHeaderRef = this.setHeaderRef.bind(this);
      this.setShowLoader = this.setShowLoader.bind(this);
      this.state = {
        headerRef: null,
        showLoader: true,
      };
    }

    setHeaderRef(ref: RefObject<HTMLElement>) {
      this.setState({ headerRef: ref });
    }

    setShowLoader(showLoader: boolean) {
      this.setState({ showLoader });
    }

    // const [headerRef, setHeaderRef] =
    //   useState<MutableRefObject<HTMLElement> | null>(null);
    render() {
      const { headerRef, showLoader } = this.state;

      return (
        <div className="font-sans antialiased">
          <Header headerRef={headerRef} />
          <Component
            {...this.props}
            setHeaderRef={this.setHeaderRef}
            showLoader={showLoader}
            setShowLoader={this.setShowLoader}
          />
        </div>
      );
    }
  };
}
