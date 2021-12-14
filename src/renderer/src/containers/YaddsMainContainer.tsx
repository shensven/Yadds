import React, { useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import YaddsDrawerSwitch from '../components/YaddsDrawerSwitch';
import YaddsTableBar from '../components/YaddsTableBar';
import YaddsMain from '../components/YaddsMain';
import { YaddsCtx } from '../context/YaddsContext';

const YaddsMainContainer: React.FC = ({ children }) => {
  const theme = useTheme();
  const { hasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <YaddsDrawerSwitch />
      <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh' }}>
        <YaddsTableBar />
        <Box sx={{ overflowY: 'auto', paddingLeft: theme.spacing(3), paddingRight: theme.spacing(2) }}>{children}</Box>
      </Box>
    </YaddsMain>
  );
};

export default YaddsMainContainer;
