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
    fontFamily: [
      'Barlow',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

const yaddsTheme = createTheme(yaddsPalette, {
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          userSelect: 'none',
        },
      },
    },
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
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: 'default',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          cursor: 'default',
        },
      },
    },
  },
});

export default yaddsTheme;
