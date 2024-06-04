import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchImage } from "../services/api";

const AboutPage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageId = "boss";

  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      try {
        const blob = await fetchImage(imageId);
        const blobUrl = URL.createObjectURL(blob);
        setImage(blobUrl);
      } catch (error) {
        setError("Oops! Couldn't load the image.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadImage();
  }, [imageId]);

  return (
    <Container>
      <ProfileSection loading={loading} error={error} image={image} />
      <Divider variant="middle" />
      <ContentSection />
      <ActionButtons navigate={navigate} />
    </Container>
  );
};

const ProfileSection = ({ loading, error, image }) => (
  <Box display="flex" flexDirection="column" alignItems="center" p={4}>
    {loading ? (
      <CircularProgress />
    ) : error ? (
      <Typography variant="h6" color="error" align="center">
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
      About Me
    </Typography>
    <Typography variant="h6" paragraph>
      The Beautiful Mysteries of Life
    </Typography>
  </Box>
);

const ContentSection = () => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" gutterBottom>
      Starting the Journey
    </Typography>
    <Typography variant="body1" paragraph>
      Every twist, every high and low, adds a new chapter to life's story. Let's
      dive deep together and explore this amazing journey.
    </Typography>
  </Box>
);

const ActionButtons = ({ navigate }) => (
  <Box textAlign="center" mx={4} mb={4}>
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate("/article")}
      >
        Check Out My Writings
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/contact")}
      >
        Get in Touch
      </Button>
    </Stack>
  </Box>
);

export default AboutPage;
