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
      <Box sx={{ flexGrow: 1, marginLeft: theme.spacing(3), marginRight: theme.spacing(3) }}>
        <YaddsTableBar />
        <Box sx={{ padding: theme.spacing(1) }}>{children}</Box>
      </Box>
    </YaddsMain>
  );
};

export default YaddsMainContainer;
