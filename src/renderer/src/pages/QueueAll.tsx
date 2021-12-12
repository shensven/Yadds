import { useContext } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsMain from '../components/YaddsMain';

const QueueAll: React.FC = () => {
  const { hasDrawer, setHasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Box sx={{ height: '100%', display: 'flex' }}>
        <Box sx={{ justifyContent: 'center', alignSelf: 'center' }}>
          <IconButton onClick={() => setHasDrawer(!hasDrawer)}>
            {hasDrawer ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
          </IconButton>
        </Box>
        <Box>
          <Typography paragraph sx={{ textAlign: 'justify' }}>
            QueueAll Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
            et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices
            mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus
            id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
            suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus
            vulputate scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt.
            Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur
            lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
          </Typography>
        </Box>
      </Box>
    </YaddsMain>
  );
};

export default QueueAll;
