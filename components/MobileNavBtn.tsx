import React from 'react';
import { WithMobileNavProps } from './MobileNav';

interface Props {
  barStyle?: string;
}

const MobileNavBtn: React.FunctionComponent<Props & WithMobileNavProps> = ({
  barStyle = 'text-red',
  setShowMobileNav,
}: Props & WithMobileNavProps) => {
  const bar = `bg-current h-[2px] w-full mb-2 last:mb-0 ${barStyle}`;

  return (
    <button
      type="button"
      className="w-7 lg:hidden"
      onClick={() => {
        setShowMobileNav(true);
        console.log('hi');
      }}>
      <div className={bar} />
      <div className={bar} />
      <div className={bar} />
    </button>
  );
};

export default MobileNavBtn;
