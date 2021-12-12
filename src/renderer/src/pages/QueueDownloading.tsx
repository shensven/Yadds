import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsDrawerSwitch from '../components/YaddsDrawerSwitch';
import YaddsMain from '../components/YaddsMain';

const QueueDownloading: React.FC = () => {
  const { hasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Box sx={{ height: '100%', display: 'flex' }}>
        <YaddsDrawerSwitch />
        <Box>
          <Typography paragraph sx={{ textAlign: 'justify' }}>
            QueueDownloading
          </Typography>
        </Box>
      </Box>
    </YaddsMain>
  );
};

export default QueueDownloading;
