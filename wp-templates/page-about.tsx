import React from 'react';
import withLayout, { WithLayoutProps } from 'components/Layout';

const About: React.FunctionComponent<WithLayoutProps> = ({
  setScrolledHeader,
}: WithLayoutProps) => {
  return <p>Hi</p>;
};

export default withLayout(About);
