import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const IonShapesOutline: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <path fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" d="M336 320H32L184 48l152 272z" />
      <path
        d="M265.32 194.51A144 144 0 1 1 192 320"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </SvgIcon>
  );
};

export default IonShapesOutline;
