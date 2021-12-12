import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsDrawerSwitch from '../components/YaddsDrawerSwitch';
import YaddsMain from '../components/YaddsMain';

const QueueStopped: React.FC = () => {
  const { hasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Box sx={{ height: '100%', display: 'flex' }}>
        <YaddsDrawerSwitch />
        <Box>
          <Typography paragraph sx={{ textAlign: 'justify' }}>
            QueueStopped
          </Typography>
        </Box>
      </Box>
    </YaddsMain>
  );
};

export default QueueStopped;
