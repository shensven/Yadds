import React, { useContext, useState } from 'react';
import { Box, Icon } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import inactiveSvg from '../assets/Figma/YaddsDrawerSwitch/inactive.svg';
import activeLeftSvg from '../assets/Figma/YaddsDrawerSwitch/active_left.svg';
import activeRightSvg from '../assets/Figma/YaddsDrawerSwitch/active_right.svg';

const YaddsDrawerSwitch: React.FC = () => {
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);
  const [src, setScr] = useState<string>(inactiveSvg);

  return (
    <Box sx={{ justifyContent: 'center', alignSelf: 'center' }}>
      <Icon
        sx={{ height: 40 }}
        onMouseOver={() => setScr(hasDrawer ? activeLeftSvg : activeRightSvg)}
        onMouseOut={() => setScr(inactiveSvg)}
        onClick={() => setHasDrawer(!hasDrawer)}
      >
        <img src={src} alt="" draggable="false" />
      </Icon>
    </Box>
  );
};

export default YaddsDrawerSwitch;
