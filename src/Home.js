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
import EntranceAnimation from './EntranceAnimation';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [reflections, setReflections] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://raito.pythonanywhere.com/api/reflection_list/')
      .then((response) => response.json())
      .then((data) => {
        const parsedData = JSON.parse(data);
        
        // Ensure that parsedData is an array
        if (Array.isArray(parsedData)) {
          setReflections(parsedData);
        } else {
          console.error('Data is not in the expected array format:', parsedData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAnimationEnd = () => {
    setAnimationCompleted(true);
  };

  const handleButtonClick = () => {
    navigate('/about');
  };

  return (
    <div style={{ position: 'relative' }}>
      {!animationCompleted && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <EntranceAnimation onAnimationEnd={handleAnimationEnd} />
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {animationCompleted && (
          <>
            {/* Intro Section */}
            <section style={{ textAlign: 'center', padding: '50px 0' }}>
              <Typography variant="h2" gutterBottom>
                Welcome to My Quiet Corner
              </Typography>
              <Typography variant="h6" paragraph>
                Dive deep into my contemplations and reflections on life's ironies.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleButtonClick}>
                Know More About Me
              </Button>
            </section>

            {/* My Reflections Preview */}
            <section style={{ padding: '50px 0' }}>
              <Typography variant="h4" gutterBottom>
                My Latest Reflections
              </Typography>
              <Grid container spacing={4}>
                {reflections.slice(0, cardsToShow).map((reflection, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <CardActionArea style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                        <Box style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          margin: '10px',
                          borderRadius: '10px',
                          height: '100%',
                        }}>
                          <CardMedia
                            component="img"
                            alt="Reflection Image"
                            height="140"
                            image={reflection.fields.imageUrl}
                            style={{ 
                              objectFit: 'contain',
                              width: '100%',
                              display: 'block',
                              alignItems: 'flex-start',
                            }}
                          />
                        </Box>
                        <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                          <Typography variant="h6">{reflection.fields.title}</Typography>
                          <Typography>{reflection.fields.description}</Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Only one Read More button below the Grid */}
              {cardsToShow < reflections.length && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Button onClick={() => setCardsToShow(cardsToShow + 3)}>Read More</Button>
                </div>
              )}
            </section>

            {/* Testimonials or Guest Comments */}
            <section style={{ textAlign: 'center', padding: '50px 0' }}>
              <Typography variant="h4" gutterBottom>
                Thoughts from My Guests
              </Typography>
              <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                "Your reflections resonate deeply with me." - nobody
              </Typography>
              {/* Repeat for more comments */}
            </section>

            {/* Final Call-to-Action */}
            <section style={{ textAlign: 'center', padding: '50px 0' }}>
              <Typography variant="h4" gutterBottom>
                Feel the Resonance?
              </Typography>
              <Typography variant="h6" paragraph>
                Reach out and share your thoughts or collaborate with me.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/contact')}
              >
                Contact Me
              </Button>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
