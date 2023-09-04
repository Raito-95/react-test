import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  List,
  ListItemText,
  ListItemButton,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar,
  Box,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';

import Fun from './Fun';
import Home from './Home';
import About from './About';
import Contact from './Contact';

import {
  AppContainer,
  MenuButton,
  StyledMenuIcon,
  ScrollToTopButton,
  KeyboardArrowUpStyledIcon,
} from './Styles';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1565C0',
      },
      secondary: {
        main: '#2196F3',
      },
    },
  });

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContainer>
          <AppBar position="sticky">
            <Toolbar>
              <MenuButton onClick={toggleMenu} sx={{ margin: 'auto 0' }}>
                <StyledMenuIcon />
              </MenuButton>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', marginLeft: '50px' }}>
                <ListItemButton component={Link} to="/" sx={{ textAlign: 'center' }}>
                  <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton component={Link} to="/about" sx={{ textAlign: 'center' }}>
                  <ListItemText primary="About" />
                </ListItemButton>
                <ListItemButton component={Link} to="/fun" sx={{ textAlign: 'center' }}>
                  <ListItemText primary="Fun" />
                </ListItemButton>
                <ListItemButton component={Link} to="/contact" sx={{ textAlign: 'center' }}>
                  <ListItemText primary="Contact" />
                </ListItemButton>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
            <List>
              <ListItemButton component={Link} to="/" onClick={toggleMenu}>
                <ListItemText primary="Home" />
              </ListItemButton>
              <ListItemButton component={Link} to="/about" onClick={toggleMenu}>
                <ListItemText primary="About" />
              </ListItemButton>
              <ListItemButton component={Link} to="/fun" onClick={toggleMenu}>
                <ListItemText primary="Fun" />
              </ListItemButton>
              <ListItemButton component={Link} to="/contact" onClick={toggleMenu}>
                <ListItemText primary="Contact" />
              </ListItemButton>
              <ListItemButton sx={{ padding: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(prev => !prev)}
                      name="darkModeToggle"
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                  labelPlacement="start"
                  sx={{ marginLeft: 1 }}
                />
              </ListItemButton>
            </List>
          </Drawer>
          {showScrollToTop && (
            <ScrollToTopButton style={{ zIndex: 1000 }} onClick={scrollToTop}>
              <KeyboardArrowUpStyledIcon />
            </ScrollToTopButton>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/fun" element={<Fun />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
