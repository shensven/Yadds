import { useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsMain from '../components/YaddsMain';

const QueueFinished: React.FC = () => {
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        QueueFinished
      </Typography>
      <Button onClick={() => setHasDrawer(!hasDrawer)}>Handle Drawer</Button>
    </YaddsMain>
  );
};

export default QueueFinished;
