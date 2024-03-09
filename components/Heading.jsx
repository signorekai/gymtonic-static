import React from 'react';

// Heading allows components to pass a heading level via props.
function Heading({ level = 'h1', children, className }) {
  const H = ({ ...props }) => React.createElement(level, props, children);

  return <H className={className}>{children}</H>;
}

export default Heading;
