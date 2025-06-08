'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LightMode,
  DarkMode,
  Add,
  List as ListIcon,
  Dashboard,
  ImportExport,
} from '@mui/icons-material';
import { useAtom } from 'jotai';
import { themeAtom } from '@/atoms';
import { useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Cadastrar Animal', icon: <Add />, path: '/cadastro' },
  { text: 'Lista de Animais', icon: <ListIcon />, path: '/lista' },
  { text: 'Importar/Exportar', icon: <ImportExport />, path: '/importar-exportar' },
];

export function Layout({ children }: LayoutProps) {
  const [themeMode, setThemeMode] = useAtom(themeAtom);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawerContent = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              cursor: 'pointer',
              backgroundColor: pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              mx: 1,
              borderRadius: 1,
            }}
          >
            <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  color: pathname === item.path ? 'primary.main' : 'inherit',
                  fontWeight: pathname === item.path ? 600 : 400,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🐾 Cadastro de Animais
          </Typography>

          <IconButton color="inherit" onClick={toggleTheme}>
            {themeMode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        variant={isMobile ? 'temporary' : 'persistent'}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          pb: 3,
          ml: !isMobile && drawerOpen ? '250px' : 0,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}

