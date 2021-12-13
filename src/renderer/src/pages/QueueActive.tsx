import { useContext } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsDrawerSwitch from '../components/YaddsDrawerSwitch';
import YaddsMain from '../components/YaddsMain';
import YaddsTableBar from '../components/YaddsTableBar';

const QueueActive: React.FC = () => {
  const theme = useTheme();
  const { hasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <YaddsDrawerSwitch />
      <Box sx={{ flexGrow: 1, marginLeft: theme.spacing(3), marginRight: theme.spacing(3) }}>
        <YaddsTableBar />
        <Box sx={{ padding: theme.spacing(1) }}>
          <Typography paragraph sx={{ textAlign: 'justify' }}>
            QueueActive
          </Typography>
        </Box>
      </Box>
    </YaddsMain>
  );
};

export default QueueActive;
