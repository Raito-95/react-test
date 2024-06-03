import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const BASE_IMAGE_URL =
  process.env.REACT_APP_API_BASE_URL + "get_image/?image_name=";

function ReflectionCard({ reflection }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = `${BASE_IMAGE_URL}reflection_${reflection.id}.webp`;

  return (
    <Card
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 2,
        borderRadius: "16px",
        height: "100%",
      }}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <Box
          sx={{
            height: {
              xs: "200px",
              sm: "250px",
              md: "250px",
              lg: "300px",
              xl: "300px",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "hidden",
            padding: 2,
          }}
        >
          <CardMedia
            component="img"
            alt={reflection.title}
            image={imageUrl}
            title={reflection.title}
            sx={{
              height: "110%",
              objectFit: "contain",
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!imageLoaded && !imageError && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          {imageError && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Image failed to load
            </Typography>
          )}
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Typography gutterBottom variant="h6">
            {reflection.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {reflection.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ReflectionCard;
