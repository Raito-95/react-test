import React from "react";
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

const useImageLoader = (imageId, type) => {
  const [imageUrl, setImageUrl] = React.useState(null);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const blob = await fetchImage(imageId, type);
        const blobUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setImageUrl(blobUrl);
          setImageLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          setImageError(true);
          console.error("Fetch error:", error);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      setImageUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
    };
  }, [imageId, type]);

  return { imageUrl, imageLoaded, imageError };
};

const sanitizeText = (text) => {
  const element = document.createElement("div");
  element.innerText = text;
  return element.innerHTML;
};

function ReflectionCard({ reflection }) {
  const { imageUrl, imageLoaded, imageError } = useImageLoader(
    reflection.id,
    "reflection"
  );

  const preventImageDownload = (e) => {
    e.preventDefault();
  };

  return (
    <Card
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        m: 2,
        borderRadius: 2,
        height: "100%",
      }}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <Box
          sx={{
            height: { xs: 200, sm: 250, md: 250, lg: 300, xl: 300 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            overflow: "hidden",
            p: 2,
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
        </Box>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            p: 2,
          }}
        >
          <Typography gutterBottom variant="h6" noWrap>
            {sanitizeText(reflection.title)}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {sanitizeText(reflection.description)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ReflectionCard;
