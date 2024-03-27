import React, { useState, useEffect } from "react";
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

const TopBar = ({ setThemeMode }) => {
  const [currentThemeMode, setCurrentThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setThemeMode(currentThemeMode);
  }, [currentThemeMode, setThemeMode]);

  const toggleThemeMode = () => {
    const newMode = currentThemeMode === "dark" ? "light" : "dark";
    setCurrentThemeMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return (
    <AppBar position="static">
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
