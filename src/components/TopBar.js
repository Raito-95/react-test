import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  styled,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from "@mui/icons-material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  transition: "transform 0.3s ease, color 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.dark,
    transform: "scale(1.1)",
  },
  "&:active": {
    transform: "rotate(15deg)",
  },
}));

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `${r}, ${g}, ${b}`;
};

const TopBar = ({ setThemeMode }) => {
  const theme = useTheme();
  const [currentThemeMode, setCurrentThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 100;
      const maxOpacityScroll = 300;
      let newOpacity = 1;

      if (window.scrollY > threshold) {
        newOpacity = Math.max(
          0.8,
          1 - (window.scrollY - threshold) / maxOpacityScroll
        );
      }

      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setThemeMode(currentThemeMode);
  }, [currentThemeMode, setThemeMode]);

  const toggleThemeMode = () => {
    const newMode = currentThemeMode === "dark" ? "light" : "dark";
    setCurrentThemeMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return (
    <AppBar
      position="fixed"
      style={{
        backgroundColor: `rgba(${hexToRgb(
          theme.palette.background.paper
        )}, ${opacity})`,
      }}
    >
      <Toolbar>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
        >
          <StyledMenuIcon />
        </IconButton>
        <Box flexGrow={1} />

        <IconButton
          color="inherit"
          component="a"
          href="https://www.linkedin.com/in/raito-chiu-518865100/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          color="inherit"
          component="a"
          href="https://github.com/Raito-95"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </IconButton>

        <IconButton color="inherit" onClick={toggleThemeMode}>
          {currentThemeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List>
            <ListItemButton
              component={Link}
              to="/"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="Home" />
            </ListItemButton>
            {["About", "Anime", "Article", "Contact", "Sensor"].map((text) => (
              <ListItemButton
                key={text}
                component={Link}
                to={`/${text.toLowerCase()}`}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
