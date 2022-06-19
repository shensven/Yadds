import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

const TablerArrowNarrowDown: React.FC<SvgIconProps> = (props) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SvgIcon width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 5v14m4-4l-4 4m-4-4l4 4"
      />
    </SvgIcon>
  );
};

export default TablerArrowNarrowDown;
