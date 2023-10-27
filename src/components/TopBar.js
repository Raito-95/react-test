import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    styled
} from '@mui/material';
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
    transition: 'transform 0.3s ease, color 0.3s ease',
    '&:hover': {
        color: theme.palette.primary.dark,
        transform: 'scale(1.1)',
    },
    '&:active': {
        transform: 'rotate(15deg)',
    },
}));

const TopBar = ({ setDarkMode }) => {
    const [localDarkMode, setLocalDarkMode] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !localDarkMode;
        setLocalDarkMode(newMode);
        setDarkMode(newMode);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
                    <StyledMenuIcon />
                </IconButton>
                <Box flexGrow={1} />

                {/* Social Media Icons */}
                <IconButton color="inherit" component="a" href="https://www.linkedin.com/in/raito-chiu-518865100/" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon />
                </IconButton>
                <IconButton color="inherit" component="a" href="https://github.com/Raito-95" target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                </IconButton>

                <IconButton color="inherit" onClick={toggleDarkMode}>
                    {localDarkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                {/* Drawer for mobile view */}
                <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                    <List>
                        <ListItemButton component={Link} to="/" onClick={() => setDrawerOpen(false)}>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/about" onClick={() => setDrawerOpen(false)}>
                            <ListItemText primary="About" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/anime" onClick={() => setDrawerOpen(false)}>
                            <ListItemText primary="Anime" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/article" onClick={() => setDrawerOpen(false)}>
                            <ListItemText primary="Article" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/contact" onClick={() => setDrawerOpen(false)}>
                            <ListItemText primary="Contact" />
                        </ListItemButton>
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
