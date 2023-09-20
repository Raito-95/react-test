import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Avatar, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function About() {
  const [image, setImage] = useState(null);
  const [image_name] = useState('boss2.webp');
  const imageUrl = `https://Raito.pythonanywhere.com/api/get_image/?image_name=${image_name}`;
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/contact');
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImage(blobUrl);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchImage();
  }, [imageUrl]);


  return (
    <Container style={{ padding: '50px 20px' }}>
      <Typography variant="h3" align="center" gutterBottom>
        About Me
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        A quiet corner where I express my contemplations and melancholic reflections on life.
      </Typography>

      <Grid container spacing={5} justifyContent="center" style={{ marginTop: '50px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Avatar 
              src={image}
              alt="Image photo" 
              style={{ width: '150px', height: '150px', margin: '0 auto' }} 
            />
            <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
              Raito
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary">
              Observer of Life's Ironies
            </Typography>
            <Typography variant="body1" align="center" style={{ marginTop: '20px' }}>
              Finding solace in the tranquility of words.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" align="center" style={{ margin: '50px 0' }}>
        My Reflections
      </Typography>
      <Typography variant="body1" paragraph>
        My personal reflections on life, its ups and downs, and the myriad emotions it brings.
      </Typography>
      {/* ... More paragraphs or other components ... */}

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleButtonClick}
      >
        Contact Me
      </Button>
      </div>
    </Container>
  );
}

export default About;
