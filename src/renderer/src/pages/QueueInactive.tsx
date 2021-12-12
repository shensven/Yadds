import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsDrawerSwitch from '../components/YaddsDrawerSwitch';
import YaddsMain from '../components/YaddsMain';

const QueueInactive: React.FC = () => {
  const { hasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Box sx={{ height: '100%', display: 'flex' }}>
        <YaddsDrawerSwitch />
        <Box>
          <Typography paragraph sx={{ textAlign: 'justify' }}>
            QueueInactive
          </Typography>
        </Box>
      </Box>
    </YaddsMain>
  );
};

export default QueueInactive;
