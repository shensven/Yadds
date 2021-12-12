import { useContext } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { YaddsCtx } from '../context/YaddsContext';
import YaddsDrawerSwitch from '../components/YaddsDrawerSwitch';
import YaddsMain from '../components/YaddsMain';
import YaddsTableBar from '../components/YaddsTableBar';

const QueueAll: React.FC = () => {
  const theme = useTheme();
  const { hasDrawer } = useContext(YaddsCtx);

  return (
    <YaddsMain halfWidth={hasDrawer}>
      <Box sx={{ display: 'flex' }}>
        <YaddsDrawerSwitch />
        <Box sx={{ marginLeft: theme.spacing(3), marginRight: theme.spacing(3) }}>
          <YaddsTableBar />
          <Typography paragraph sx={{ textAlign: 'justify' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi
            tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id
            interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
            suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus
            vulputate scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt.
            Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur
            lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
            imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id
            interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
            suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus
            vulputate scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt.
            Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur
            lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
            imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id
            interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
            suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus
            vulputate scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt.
            Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur
            lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
            imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id
            interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
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
