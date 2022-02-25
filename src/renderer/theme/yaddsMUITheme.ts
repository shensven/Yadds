import { createTheme, darkScrollbar, PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    input: {
      default: string;
    };
    card: {
      default: string;
    };
  }
  interface PaletteOptions {
    input?: {
      default: string;
    };
    card?: {
      default: string;
    };
  }
}

const designTokens = (mode: PaletteMode) => {
  return {
    palette: {
      mode,
      [(mode === 'light' && 'primary') as string]: {
        main: '#007fff',
        dark: '#0059b2',
      },
      [(mode === 'dark' && 'primary') as string]: {
        main: '#007fff',
        dark: '#0059b2',
      },
      [(mode === 'light' && 'text') as string]: {
        primary: '#424242',
        secondary: '#636363',
        disabled: '#A7A7A7',
      },
      [(mode === 'dark' && 'text') as string]: {
        primary: '#EBEBEB',
        secondary: '#BABBBA',
        disabled: '#747474',
      },
      [(mode === 'light' && 'background') as string]: {
        default: 'transparent',
        paper: '#FFFFFF',
      },
      [(mode === 'dark' && 'background') as string]: {
        default: 'transparent',
        paper: '#282828',
      },
      [(mode === 'light' && 'input') as string]: {
        default: '#F5F5F5',
      },
      [(mode === 'dark' && 'input') as string]: {
        default: '#4B4B4B',
      },
      [(mode === 'light' && 'card') as string]: {
        default: '#F5F5F5',
      },
      [(mode === 'dark' && 'card') as string]: {
        default: '#3A3A3A',
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
