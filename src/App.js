import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import AnimePage from './components/AnimePage';
import ArticlePage from './components/ArticlePage';
import ContactPage from './components/ContactPage';
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

// App component - Main application entry point
const App = () => {
  // Retrieve previous visit status from session storage
  const hasVisitedBefore = sessionStorage.getItem('hasVisited');

  // States to manage dark mode and animation completion
  const [darkMode, setDarkMode] = useState(false);
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

  // Create theme for the application, including setting the font
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: '"Georgia", serif',
    },
  });

  return (
    // ThemeProvider wraps the components, providing them the theme styling
    <ThemeProvider theme={theme}>
      <CssBaseline />  // Reset and baseline styling for browsers
      <div id="back-to-top-anchor"></div>  // Anchor for the scroll to top functionality
      <Router>
        {animationCompleted ? (
          <>
            // TopBar component for navigation and dark mode toggle
            <TopBar setDarkMode={setDarkMode} darkMode={darkMode} />
            // Routes for different pages in the application
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/anime" element={<AnimePage />} />
              <Route path="/article" element={<ArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </>
        ) : (
          // Entrance animation for first-time visitors
          <EntranceAnimation>
            Welcome
          </EntranceAnimation>
        )}
        // Floating button to scroll back to the top
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
