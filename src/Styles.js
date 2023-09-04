import { styled } from '@mui/material/styles';
import { 
    IconButton, 
    Button, 
    Typography, 
    ListItem, 
    Link 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


// ----- App Styles -----

// Main container for the application.
export const AppContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

// Icon button for opening a menu.
export const MenuButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: theme.spacing(1),
  color: theme.palette.secondary.main,
}));

// Styling for the menu icon.
export const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  fontSize: '2rem',
  color: 'white',
}));

// Scroll to the top button.
export const ScrollToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
  },
}));

// Styling for the keyboard arrow-up icon.
export const KeyboardArrowUpStyledIcon = styled(KeyboardArrowUpIcon)(({ theme }) => ({
  fontSize: '1.5rem',
}));


// ----- Fun Styles -----

// Title for the anime section.
export const AnimeTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: 'transparent',
  backgroundImage: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(173, 216, 230, 1) 50%, rgba(255, 255, 255, 1) 100%)'
      : 'linear-gradient(135deg, rgba(0, 53, 128, 0.9) 50%, rgba(135, 206, 250, 0.9) 100%)',
  WebkitBackgroundClip: 'text',
}));

// Container for buttons indicating the year.
export const YearButtonsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0',
  width: '100%',
}));

// Individual year button.
export const YearButton = styled(Button)(({ theme }) => ({
  width: '40px',
  height: '40px',
  margin: theme.spacing(0, 1),
  borderRadius: '50%',
  backgroundColor: 'transparent',
  color: theme.palette.mode === 'dark' ? 'rgba(173, 216, 230, 0.9)' : theme.palette.primary.dark,
  border: 'none',
  padding: 0,
  transition: 'all 0.3s',
  '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&:active': {
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
}));

// Season for the anime.
export const AnimeSeason = styled('span')(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1),
  textAlign: 'center',
  color: 'transparent',
  backgroundImage: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(173, 216, 230, 0.8) 50%, rgba(255, 255, 255, 0.8) 100%)'
      : 'linear-gradient(135deg, rgba(0, 53, 128, 0.8) 50%, rgba(135, 206, 250, 1) 100%)',
  WebkitBackgroundClip: 'text',
}));

// List item for each anime entry.
export const AnimeListItem = styled(ListItem)({
  display: 'block',
  marginBottom: '10px',
  textAlign: 'center',
});

// Links for the anime entries.
export const AnimeLink = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'transparent',
  backgroundImage: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(173, 216, 230, 0.7) 50%, rgba(255, 255, 255, 0.7) 100%)'
      : 'linear-gradient(135deg, rgba(0, 53, 128, 0.9) 50%, rgba(0, 174, 255, 0.9) 100%)',
  WebkitBackgroundClip: 'text',
  '&:hover': {
      textDecoration: 'underline',
      backgroundImage: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(173, 216, 230, 0.9) 50%, rgba(255, 255, 255, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(0, 53, 128, 1) 50%, rgba(0, 174, 255, 1) 100%)',
  },
  '& > a': {
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
  },
}));