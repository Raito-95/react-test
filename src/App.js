import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AnimePage from './pages/AnimePage';
import ArticlePage from './pages/ArticlePage';
import ContactPage from './pages/ContactPage';
import TopBar from './components/TopBar';
import EntranceAnimation from './components/EntranceAnimation';

import { Fab, Zoom, useScrollTrigger, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function ScrollTop(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box onClick={handleClick} position="fixed" bottom={16} right={16} zIndex="tooltip">
        {children}
      </Box>
    </Zoom>
  );
}

const App = () => {
  // Retrieve previous visit status from session storage
  const hasVisitedBefore = sessionStorage.getItem('hasVisited');

  // Retrieve the theme mode from localStorage or set to 'light' as default
  const storedThemeMode = localStorage.getItem('themeMode') || 'light';
  
  // States to manage theme mode and animation completion
  const [themeMode, setThemeMode] = useState(storedThemeMode);
  const [animationCompleted, setAnimationCompleted] = useState(!!hasVisitedBefore);

  // Timeout for animation completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000);
    return () => clearTimeout(timer);  // Cleanup timer on component unmount
  }, []);

  // Check if the site has been visited before and update session storage
  useEffect(() => {
    if (!hasVisitedBefore) {
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, [hasVisitedBefore]);

  // Store the theme mode in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  // Create theme for the application, including setting the font
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
    typography: {
      fontFamily: '"Georgia", serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="back-to-top-anchor"></div>
      <Router>
        {animationCompleted ? (
          <>
            <TopBar setThemeMode={setThemeMode} themeMode={themeMode} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/anime" element={<AnimePage />} />
              <Route path="/article" element={<ArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </>
        ) : (
          <EntranceAnimation>
            Welcome
          </EntranceAnimation>
        )}
        <ScrollTop>
          <Fab color="primary" size="small" aria-label="scroll back to top">
            <ArrowUpwardIcon />
          </Fab>
        </ScrollTop>
      </Router>
    </ThemeProvider>
  );
};

export default App;
