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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: 'normal',
        },
      },
    },
  },
});

export default yaddsTheme;
