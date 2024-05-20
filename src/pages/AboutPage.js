import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

function AboutPage() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageName = "boss.webp";
  const imageUrl = useMemo(
    () => `${BASE_API_URL}get_image/?image_name=${imageName}`,
    [imageName]
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImage(blobUrl);
      } catch (error) {
        setError("Failed to load image");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImage();
  }, [imageUrl]);

  return (
    <Box p={4}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {loading ? (
          <CircularProgress sx={{ mb: 2 }} />
        ) : error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : (
          <Avatar
            src={image}
            alt="Profile Image"
            sx={{ width: 150, height: 150, mb: 2 }}
          />
        )}
        <Typography variant="h3" gutterBottom>
          Raito's Musings
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          A Chronicle of Life's Beautiful Mysteries
        </Typography>
      </Box>

      <Divider variant="middle" sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        Embarking on a Journey
      </Typography>
      <Typography variant="body1" paragraph>
        Every twist and turn, every high and low, is a new chapter in the story
        of life. Dive deep into my introspections as we navigate through this
        incredible journey together.
      </Typography>

      <Box mt={5} textAlign="center">
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/article")}
          >
            Explore Writings
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/contact")}
          >
            Connect with Me
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default AboutPage;
