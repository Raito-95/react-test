import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
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
import { SiLeetcode } from "react-icons/si";

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

const StyledListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  transition: "background-color 0.3s ease, transform 0.3s ease",
  backgroundColor: selected ? theme.palette.action.selected : "inherit",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const TopBar = ({ setThemeMode }) => {
  const location = useLocation();
  const [currentThemeMode, setCurrentThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const threshold = 15;

      if (currentScrollPosition === 0) {
        setHide(false);
      } else if (currentScrollPosition - scrollPosition > threshold) {
        setHide(true);
      } else if (scrollPosition - currentScrollPosition > threshold) {
        setHide(false);
      }
      setScrollPosition(currentScrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  useEffect(() => {
    setThemeMode(currentThemeMode);
  }, [currentThemeMode, setThemeMode]);

  const toggleThemeMode = () => {
    const newMode = currentThemeMode === "dark" ? "light" : "dark";
    setCurrentThemeMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

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
      sx={{
        transition: "transform 0.3s ease",
        transform: hide ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <Toolbar>
        <StyledIconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2 }}
        >
          <StyledMenuIcon />
        </StyledIconButton>
        <Box sx={{ flexGrow: 1 }} />
        <SocialMediaLinks />
        <StyledIconButton
          color="inherit"
          onClick={toggleThemeMode}
          aria-label="Toggle theme"
          sx={{ mx: 1 }}
        >
          {currentThemeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </StyledIconButton>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <MenuList
            menuItems={menuItems}
            currentPath={location.pathname}
            closeDrawer={() => setDrawerOpen(false)}
          />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

const MenuList = ({ menuItems, currentPath, closeDrawer }) => (
  <List>
    {menuItems.map((item) => (
      <MenuItem
        key={item.text}
        text={item.text}
        icon={item.icon}
        link={item.link}
        isActive={currentPath === item.link}
        onClick={closeDrawer}
      />
    ))}
  </List>
);

const MenuItem = ({ text, icon, link, isActive, onClick }) => (
  <StyledListItemButton
    component={Link}
    to={link}
    selected={isActive}
    onClick={onClick}
    sx={{ px: 3 }}
  >
    <Box display="flex" alignItems="center">
      {icon}
      <ListItemText primary={text} sx={{ ml: 2 }} />
    </Box>
  </StyledListItemButton>
);

const SocialMediaLinks = () => (
  <>
    <StyledIconButton
      color="inherit"
      component="a"
      href="https://www.linkedin.com/in/raito-chiu-518865100/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      sx={{ mx: 1 }}
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
      sx={{ mx: 1 }}
    >
      <GitHubIcon />
    </StyledIconButton>
    <StyledIconButton
      color="inherit"
      component="a"
      href="https://leetcode.com/u/Raito-95/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LeetCode"
      sx={{ mx: 1 }}
    >
      <SiLeetcode />
    </StyledIconButton>
  </>
);

export default TopBar;
