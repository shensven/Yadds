import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const IonCheckmarkCircleOutline: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M352 176L217.6 336L160 272"
      />
    </SvgIcon>
  );
};

export default IonCheckmarkCircleOutline;
