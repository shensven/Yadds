import { createTheme } from '@mui/material';

const yaddsPalette = createTheme({
  palette: {
    primary: {
      main: '#007fff',
    },
  },
});

const yaddsTheme = createTheme(yaddsPalette, {
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default yaddsTheme;
