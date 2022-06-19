import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const IonServerOutline: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <ellipse
        cx="256"
        cy="128"
        rx="192"
        ry="80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        d="M448 214c0 44.18-86 80-192 80S64 258.18 64 214"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        d="M448 300c0 44.18-86 80-192 80S64 344.18 64 300"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        d="M64 127.24v257.52C64 428.52 150 464 256 464s192-35.48 192-79.24V127.24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
    </SvgIcon>
  );
};

export default IonServerOutline;
