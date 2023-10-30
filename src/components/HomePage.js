import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    Button, 
    Box, 
    Grid, 
    Card, 
    CardContent, 
    CardActionArea, 
    CardMedia,  
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const HomePage = () => {
  // State to store the list of reflections
  const [reflections, setReflections] = useState([]);
  
  // State to determine how many cards to display
  const [displayCount, setDisplayCount] = useState(9); 
  const navigate = useNavigate();

  // Fetching the reflection data on component mount
  useEffect(() => {
    fetch(`${BASE_API_URL}reflection_list/`)
      .then((response) => response.json())
      .then((data) => {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
          setReflections(parsedData);
        } else {
          console.error('Data format mismatch:', parsedData);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handler for the "Load More" button
  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 9); // Increase the number of cards displayed by 9
  };

  return (
    <>
      <Box py={4} textAlign="center" sx={{ 
      }}>
        <Typography variant="h2" gutterBottom>
          Whispers of the Heart
        </Typography>
        <Typography variant="h5" paragraph>
          A symphony of thoughts, dreams, and musings.
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/about')}
        >
          Dive Into My Journey
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reflections.slice(0, displayCount).map((reflection, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Card elevation={3} sx={{ height: '420px', display: 'flex', flexDirection: 'column', margin: 3 }}>
              <CardActionArea style={{ flex: 1 }}>
                <Box sx={{ height: '180px', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
                  <CardMedia
                    component="img"
                    alt="Reflection Image"
                    height="180"
                    image={reflection.fields.imageUrl}
                    title={reflection.fields.title}
                    sx={{ objectFit: 'contain' }}
                  />
                </Box>
                {/* Description with scrollable container */}
                <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      sx={{ height: '40px'}}
                    >
                      {reflection.fields.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                    >
                      {reflection.fields.description}
                    </Typography>
                  </CardContent>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Display the "Load More" button only if there are more reflections to show */}
      {displayCount < reflections.length && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      <Box py={5} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Share in the Echoes
        </Typography>
        <Typography variant="h6" paragraph>
          Have stories of your own? Let's weave our tales together.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/contact')}
        >
          Connect with Me
        </Button>
      </Box>
    </>
  );
};

export default HomePage;
