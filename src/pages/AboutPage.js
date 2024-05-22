import React, { useState, useEffect, useMemo } from "react";
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

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const AboutPage = () => {
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
    const fetchImage = async () => {
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
    };
    fetchImage();
  }, [imageUrl]);

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
      A Chronicle of Life's Beautiful Mysteries
    </Typography>
  </Box>
);

const ContentSection = () => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" gutterBottom>
      Embarking on a Journey
    </Typography>
    <Typography variant="body1" paragraph>
      Every twist and turn, every high and low, is a new chapter in the story of
      life. Dive deep into my introspections as we navigate through this
      incredible journey together.
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
);

export default AboutPage;
