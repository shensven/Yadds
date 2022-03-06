import { createTheme, darkScrollbar, PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    input: { default: string };
    card: { default: string };
  }
  interface PaletteOptions {
    input?: { default: string };
    card?: { default: string };
  }
}

const designTokens = (mode: PaletteMode) => {
  return {
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#007fff' : '#007fff',
        dark: mode === 'dark' ? '#0059b2' : '#0059b2',
      },
      text: {
        primary: mode === 'dark' ? '#EBEBEB' : '#424242',
        secondary: mode === 'dark' ? '#BABBBA' : '#636363',
        disabled: mode === 'dark' ? '#747474' : '#A7A7A7',
      },
      background: {
        default: mode === 'dark' ? '#282828' : 'transparent',
      },
      input: {
        default: mode === 'dark' ? '#4B4B4B' : '#F5F5F5',
      },
      card: {
        default: mode === 'dark' ? '#3A3A3A' : '#F5F5F5',
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
  };
};

const customizeCompnents = (mode: PaletteMode) => {
  return {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: mode === 'dark' ? darkScrollbar() : null,
        },
      },
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
  };
};

const initMUITheme = (mode: 'light' | 'dark') => {
  return createTheme(designTokens(mode), customizeCompnents(mode));
};

export default initMUITheme;
