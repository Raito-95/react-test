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

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="back-to-top-anchor"></div>
      <Router>
        {animationCompleted ? (
          <>
            <TopBar setDarkMode={setDarkMode} darkMode={darkMode} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/anime" element={<AnimePage />} />
              <Route path="/article" element={<ArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </>
        ) : (
          <EntranceAnimation />
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
