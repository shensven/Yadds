import { createTheme } from '@mui/material';

const yaddsPalette = createTheme({
  palette: {
    primary: {
      main: '#007fff',
      dark: '#0059b2',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: ['Barlow'].join(','),
  },
});

const yaddsTheme = createTheme(yaddsPalette, {
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 0,
          justifyContent: 'space-between',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          cursor: 'default',
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: 'default',
        },
      },
    },
  },
});

export default yaddsTheme;
