import {
  SetMobileNavContext,
  SetMobileNavContextType,
} from 'components/MobileNav';
import React, { useContext, useEffect } from 'react';

interface Props {
  barStyle?: string;
}

const MobileNavBtn: React.FunctionComponent<Props> = ({
  barStyle = 'text-red',
}: Props) => {
  const setShowMobileNav =
    useContext<SetMobileNavContextType>(SetMobileNavContext);

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
