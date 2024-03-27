import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  CircularProgress,
  Fab,
  Zoom,
  useScrollTrigger,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TopBar from "./components/TopBar";
import EntranceAnimation from "./components/EntranceAnimation";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AnimePage = lazy(() => import("./pages/AnimePage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const SensorPage = lazy(() => import("./pages/SensorPage"));

const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

function ScrollTop({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        position="fixed"
        bottom={16}
        right={16}
        zIndex="tooltip"
      >
        {children}
      </Box>
    </Zoom>
  );
}

function App() {
  const storedThemeMode = localStorage.getItem("themeMode") || "light";
  const [themeMode, setThemeMode] = useState(storedThemeMode);
  const [animationCompleted, setAnimationCompleted] = useState(
    sessionStorage.getItem("hasVisited")
  );

  useEffect(() => {
    if (!animationCompleted) {
      setTimeout(() => {
        setAnimationCompleted(true);
        sessionStorage.setItem("hasVisited", "true");
      }, 2000);
    }
  }, [animationCompleted]);

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
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
      <Router>
        <div id="back-to-top-anchor" />
        {animationCompleted ? (
          <>
            <TopBar setThemeMode={setThemeMode} />
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/anime" element={<AnimePage />} />
                <Route path="/article" element={<ArticlePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/sensor" element={<SensorPage />} />
              </Routes>
            </Suspense>
          </>
        ) : (
          <EntranceAnimation>Welcome</EntranceAnimation>
        )}
        <ScrollTop>
          <Fab color="primary" size="small" aria-label="scroll back to top">
            <ArrowUpwardIcon />
          </Fab>
        </ScrollTop>
      </Router>
    </ThemeProvider>
  );
}

export default App;
