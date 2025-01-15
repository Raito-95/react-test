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
import { fetchImage as fetchImageAPI } from "../services/api";

const fetchImage = async (imageId, onSuccess, onError) => {
  try {
    const blob = await fetchImageAPI(imageId);
    const blobUrl = URL.createObjectURL(blob);
    onSuccess(blobUrl);
  } catch (error) {
    onError(error);
  }
};

const AboutPage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageId = "boss";

  const navigate = useNavigate();

  useEffect(() => {
    const handleSuccess = (url) => {
      setImage(url);
      setError(null);
    };

    const handleError = () => {
      setError("Oops! Couldn't load the image.");
    };

    setLoading(true);
    fetchImage(imageId, handleSuccess, handleError).finally(() => {
      setLoading(false);
    });
  }, [imageId]);

  return (
    <Container>
      <ProfileSection loading={loading} error={error} image={image} />
      <Divider variant="middle" sx={{ my: 4 }} />
      <ContentSection
        title="Starting the Journey"
        description="Every twist, every high and low, adds a new chapter to life's story. Let's
        dive deep together and explore this amazing journey."
      />
      <Divider variant="middle" sx={{ my: 4 }} />
      <ActionButtons navigate={navigate} />
    </Container>
  );
};

const ProfileSection = ({ loading, error, image }) => (
  <InfoSection
    loading={loading}
    error={error}
    image={image}
    title="About Me"
    subtitle="The Beautiful Mysteries of Life"
    imageAlt="Profile Image"
    avatarSize={150}
  />
);

const InfoSection = ({
  loading,
  error,
  image,
  title,
  subtitle,
  imageAlt,
  avatarSize = 100,
}) => (
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
        alt={imageAlt}
        sx={{ width: avatarSize, height: avatarSize, mb: 2 }}
      />
    )}
    <Typography variant="h3" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h6" paragraph>
      {subtitle}
    </Typography>
  </Box>
);

const ContentSection = ({ title, description }) => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" paragraph>
      {description}
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
