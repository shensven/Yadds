import { Box, Typography } from '@mui/material';
import YaddsMain from '../containers/YaddsMain';

const Settings: React.FC = () => {
  return (
    <YaddsMain hasAppbar={false}>
      <Box sx={{ height: '100%', display: 'flex' }}>
        <Typography paragraph sx={{ textAlign: 'justify' }}>
          Settings
        </Typography>
      </Box>
    </YaddsMain>
  );
};

export default Settings;
