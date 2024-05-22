import React, { useState, useEffect } from "react";
import { useTheme, styled } from "@mui/material/styles";
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
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Movie as MovieIcon,
  Article as ArticleIcon,
  ContactMail as ContactMailIcon,
  Sensors as SensorsIcon,
} from "@mui/icons-material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  transition: "transform 0.3s ease, color 0.3s ease",
  "&:hover": {
    color: theme.palette.secondary.main,
    transform: "scale(1.1)",
  },
  "&:active": {
    transform: "rotate(15deg)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "transform 0.3s ease, color 0.3s ease",
  "&:hover": {
    color: theme.palette.secondary.main,
    transform: "scale(1.1)",
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  transition: "background-color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const hexToRgb = (hex) => {
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
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
      const newOpacity =
        window.scrollY > threshold
          ? Math.max(0.8, 1 - (window.scrollY - threshold) / maxOpacityScroll)
          : 1;
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

  const backgroundColor = `rgba(${hexToRgb(
    theme.palette.mode === "dark"
      ? theme.palette.background.paper
      : theme.palette.primary.main
  )}, ${opacity})`;

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, link: "/" },
    { text: "About", icon: <InfoIcon />, link: "/about" },
    { text: "Anime", icon: <MovieIcon />, link: "/anime" },
    { text: "Article", icon: <ArticleIcon />, link: "/article" },
    { text: "Contact", icon: <ContactMailIcon />, link: "/contact" },
    { text: "Sensor", icon: <SensorsIcon />, link: "/sensor" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{ background: backgroundColor, transition: "background 0.3s ease" }}
    >
      <Toolbar>
        <StyledIconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
        >
          <StyledMenuIcon />
        </StyledIconButton>
        <Box flexGrow={1} />
        <StyledIconButton
          color="inherit"
          component="a"
          href="https://www.linkedin.com/in/raito-chiu-518865100/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </StyledIconButton>
        <StyledIconButton
          color="inherit"
          component="a"
          href="https://github.com/Raito-95"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </StyledIconButton>
        <StyledIconButton
          color="inherit"
          onClick={toggleThemeMode}
          aria-label="Toggle theme"
        >
          {currentThemeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </StyledIconButton>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List>
            {menuItems.map((item) => (
              <StyledListItemButton
                key={item.text}
                component={Link}
                to={item.link}
                onClick={() => setDrawerOpen(false)}
              >
                <Box display="flex" alignItems="center">
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />
                </Box>
              </StyledListItemButton>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
