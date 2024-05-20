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

function ReflectionCard({ reflection }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      elevation={3}
      sx={{
        height: "420px",
        display: "flex",
        flexDirection: "column",
        margin: 3,
        borderRadius: "24px",
      }}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <Box
          sx={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            alt={reflection.title}
            height="200"
            image={reflection.image_url}
            title={reflection.title}
            sx={{ objectFit: "contain", px: "10px" }}
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
            maxHeight: "200px",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
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
