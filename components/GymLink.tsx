import React from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  text: string;
  linkStyle?: 'red' | 'white';
  type?: 'above' | 'inline';
}

const GymLink: React.FunctionComponent<Props> = ({
  href,
  text,
  linkStyle = 'red',
  type = 'above',
}: Props) => (
  <div
    className={`flex group items-center mt-2 md:mt-0 ${
      type === 'above' ? 'flex-col' : 'flex-row'
    }`}>
    <svg
      className={
        type === 'above'
          ? 'mb-2 group-hover:-translate-y-1 transition-transform duration-100'
          : 'group-hover:-translate-x-1 mr-2 transition-transform duration-100'
      }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 162.34 198.05"
      width="14"
      height="17">
      <path
        className="fill-current"
        d="M162,72.08c-5.36-90.8-145.72-98.3-160.12-8.31C-11.3,123.07,49,157.85,81.5,198.05,112.08,159.55,167.38,127.45,162,72.08ZM81.25,113.56c-44.91.81-43.23-70,.52-68.16C125.4,45.32,125.19,114.35,81.25,113.56Z"
      />
    </svg>
    <Link href={href}>
      <a
        className={`${
          type === 'above'
            ? 'font-black text-xs md:text-base'
            : 'text-xs uppercase'
        }
          ${
            linkStyle === 'red' ? 'text-red' : 'text-white'
          } group-hover:opacity-90 transition-opacity duration-100`}>
        {text}
      </a>
    </Link>
  </div>
);

export default GymLink;
