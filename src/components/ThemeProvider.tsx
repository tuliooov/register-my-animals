'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAtom } from 'jotai';
import { themeAtom } from '@/atoms';
import { ReactNode } from 'react';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const [themeMode] = useAtom(themeAtom);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      secondary: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      background: {
        default: themeMode === 'light' ? '#f5f5f5' : '#121212',
        paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: themeMode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: themeMode === 'light' 
                ? '0 4px 16px rgba(0,0,0,0.15)' 
                : '0 4px 16px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

