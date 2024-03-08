import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

function ReflectionCard({ reflection }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card elevation={3} sx={{ height: '420px', display: 'flex', flexDirection: 'column', margin: 3 }}>
      <CardActionArea style={{ flex: 1 }}>
        <Box sx={{ height: '200px', display: 'flex', alignItems: 'start', justifyContent: 'center', position: 'relative' }}>
          <CardMedia
            component="img"
            alt="Reflection Image"
            height="200"
            image={reflection.image_url}
            title={reflection.title}
            sx={{ objectFit: 'contain', paddingLeft: '10px', paddingRight: '10px' }}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
        <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
            <Typography gutterBottom variant="subtitle2">
              {reflection.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {reflection.description}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default ReflectionCard;
