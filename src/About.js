import React from 'react';
import { Container, Typography, Paper, Avatar, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function About() {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/contact'); 
  };

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
              src="/react-test/boss2.webp" 
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
