import { Box, Button, ButtonGroup, IconButton, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const YaddsTableBar: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'yellow',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button size="small" variant="outlined" startIcon={<AddIcon />}>
          新建
        </Button>
        <ButtonGroup sx={{ marginLeft: theme.spacing(2) }}>
          <IconButton size="small" sx={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1) }}>
            <PauseIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1) }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ButtonGroup>
      </Box>
      <IconButton size="small">
        <MoreHorizIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default YaddsTableBar;
