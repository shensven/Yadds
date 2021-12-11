import { useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsMain from '../components/YaddsMain';

const QueueStopped: React.FC = () => {
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        QueueStopped
      </Typography>
      <Button onClick={() => setHasDrawer(!hasDrawer)}>Handle Drawer</Button>
    </YaddsMain>
  );
};

export default QueueStopped;
