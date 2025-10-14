import { createTheme } from '@mui/material/styles';

// GitHub-inspired dark theme (modern, professional, subtle)
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58a6ff', // GitHub blue
      light: '#79c0ff',
      dark: '#1f6feb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b949e', // GitHub gray
      light: '#b1bac4',
      dark: '#6e7681',
    },
    background: {
      default: '#0d1117', // GitHub dark background
      paper: '#161b22', // GitHub dark elevated
    },
    text: {
      primary: '#c9d1d9', // GitHub primary text
      secondary: '#8b949e', // GitHub secondary text
    },
    error: {
      main: '#f85149',
    },
    warning: {
      main: '#d29922',
    },
    success: {
      main: '#3fb950',
    },
    info: {
      main: '#58a6ff',
    },
    divider: '#21262d',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: '#0d1117',
        },
        body: {
          backgroundColor: '#0d1117',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0d1117',
          borderRight: '1px solid #21262d',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: '#161b22',
          },
          '&.Mui-selected': {
            backgroundColor: '#161b22',
            '&:hover': {
              backgroundColor: '#1c2128',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161b22',
          borderBottom: '1px solid #21262d',
          boxShadow: 'none',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#21262d',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#21262d',
        },
      },
    },
  },
});
