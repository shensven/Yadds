import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const IonShapes: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path
        d="M336 336H32a16 16 0 0 1-14-23.81l152-272a16 16 0 0 1 27.94 0l152 272A16 16 0 0 1 336 336z"
        fill="currentColor"
      />
      <path
        d="M336 160a161.07 161.07 0 0 0-32.57 3.32l74.47 133.27A48 48 0 0 1 336 368H183.33A160 160 0 1 0 336 160z"
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default IonShapes;
