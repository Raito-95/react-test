import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Fab, Zoom, useScrollTrigger, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import TopBar from './components/TopBar';
import EntranceAnimation from './components/EntranceAnimation';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AnimePage = lazy(() => import('./pages/AnimePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

const Loading = () => (
  <div>Loading...</div>
);

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
  const hasVisitedBefore = sessionStorage.getItem('hasVisited');
  const storedThemeMode = localStorage.getItem('themeMode') || 'light';
  
  const [themeMode, setThemeMode] = useState(storedThemeMode);
  const [animationCompleted, setAnimationCompleted] = useState(!!hasVisitedBefore);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasVisitedBefore) {
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, [hasVisitedBefore]);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

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
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/anime" element={<AnimePage />} />
                <Route path="/article" element={<ArticlePage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </Suspense>
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
