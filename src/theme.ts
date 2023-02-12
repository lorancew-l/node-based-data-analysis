import { createTheme } from '@mui/material/styles';
declare module '@mui/material/styles' {
  interface Palette {
    accent: string;
  }
  interface PaletteOptions {
    accent: string;
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    accent: '#bb86fc',
    background: {
      default: '#1A202C',
      paper: '#2D3748',
    },
  },
});
