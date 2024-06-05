import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  CircularProgress,
  Fab,
  Zoom,
  useScrollTrigger,
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Typography variant="h5" color="error">
            Oops! Something went wrong. Please try again later.
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

const ScrollTop = ({ children }) => {
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
        role="button"
        aria-label="scroll back to top"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

const App = () => {
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
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <Box sx={{ pt: "64px", px: { xs: 2, sm: 3, md: 4 }, pb: 4 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/anime" element={<AnimePage />} />
                    <Route path="/article" element={<ArticlePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/sensor" element={<SensorPage />} />
                  </Routes>
                </Box>
              </Suspense>
            </ErrorBoundary>
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
};

export default App;
