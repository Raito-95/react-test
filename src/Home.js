import React, { useState } from 'react';
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
import reflections from './ReflectionsDB';

const Home = () => {

  const [cardsToShow, setCardsToShow] = useState(3);

  const [animationCompleted, setAnimationCompleted] = useState(false);

  const handleAnimationEnd = () => {
      setAnimationCompleted(true);
  };

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/about');
  };

  const sortedReflections = reflections.sort((a, b) => b.id - a.id);

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
                {sortedReflections.slice(0, cardsToShow).map(reflection => (
                  <Grid item xs={12} sm={4} key={reflection.id} style={{ display: 'flex' }}>
                    <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <CardActionArea style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          margin: '10px',
                          borderRadius: '10px'
                        }}>
                          <CardMedia
                            component="img"
                            alt="Reflection Image"
                            height="140"
                            image={reflection.imageUrl}
                            style={{ 
                              objectFit: 'contain',
                              width: '100%',
                            }}
                          />
                        </Box>
                        <CardContent style={{ flex: 1 }}>
                          <Typography variant="h6">{reflection.title}</Typography>
                          <Typography>{reflection.description}</Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Only one Read More button below the Grid */}
              {cardsToShow < sortedReflections.length && (
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
