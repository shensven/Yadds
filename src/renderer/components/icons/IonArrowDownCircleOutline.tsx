import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const IonArrowDownCircleOutline: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M176 262.62L256 342l80-79.38"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 330.97V170"
      />
      <path
        d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </SvgIcon>
  );
};

export default IonArrowDownCircleOutline;
