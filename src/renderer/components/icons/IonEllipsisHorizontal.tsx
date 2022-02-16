import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const IonEllipsisHorizontal: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 512 512" {...props}>
      <circle cx="256" cy="256" r="48" fill="currentColor" />
      <circle cx="416" cy="256" r="48" fill="currentColor" />
      <circle cx="96" cy="256" r="48" fill="currentColor" />
    </SvgIcon>
  );
};

export default IonEllipsisHorizontal;
