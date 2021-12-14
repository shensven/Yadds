import { createTheme } from '@mui/material';

const yaddsPalette = createTheme({
  palette: {
    primary: {
      main: '#007fff',
      dark: '#0059b2',
    },
  },
});

const yaddsTheme = createTheme(yaddsPalette, {
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 0,
          justifyContent: 'space-between',
          // backgroundColor: '#f3f6f9',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
});

export default yaddsTheme;
