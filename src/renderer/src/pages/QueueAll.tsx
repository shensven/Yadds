import { useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsMain from '../components/YaddsMain';

const QueueAll: React.FC = () => {
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        QueueAll Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi
        tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id
        interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
        adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
        scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
        lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
        ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
      </Typography>
      <Button onClick={() => setHasDrawer(!hasDrawer)}>Handle Drawer</Button>
    </YaddsMain>
  );
};

export default QueueAll;
