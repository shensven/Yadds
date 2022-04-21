import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const OS_PLATFORM = window.electron?.getOS();

const Server: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{ height: theme.spacing(5), appRegion: 'drag' }}
        onDoubleClick={() => OS_PLATFORM === 'darwin' && window.electron.zoomWindow()}
      />
      <div>server</div>
    </Box>
  );
};

export default Server;
