import React, { useState, useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { fetchImage } from "../services/api";

const sanitizeText = (text) => {
  const element = document.createElement("div");
  element.innerText = text;
  return element.innerHTML;
};

function ReflectionCard({ reflection }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const blob = await fetchImage(reflection.id, "reflection");
        const blobUrl = URL.createObjectURL(blob);
        setImageUrl(blobUrl);
        setImageLoaded(true);
      } catch (error) {
        setImageError(true);
        console.error("Fetch error:", error);
      }
    };
    loadImage();
  }, [reflection.id]);

  const preventImageDownload = (e) => {
    e.preventDefault();
  };

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
          onContextMenu={preventImageDownload}
        >
          {imageUrl && (
            <CardMedia
              component="img"
              alt={sanitizeText(reflection.title)}
              image={imageUrl}
              title={sanitizeText(reflection.title)}
              sx={{
                height: "110%",
                objectFit: "contain",
                pointerEvents: "none",
              }}
              onDragStart={(e) => e.preventDefault()}
            />
          )}
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
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.001)",
            }}
          ></Box>
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
            {sanitizeText(reflection.title)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {sanitizeText(reflection.description)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ReflectionCard;
