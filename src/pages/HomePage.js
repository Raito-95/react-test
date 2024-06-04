import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReflectionCard from "../components/ReflectionCard";
import { fetchReflectionList } from "../services/api";

const HomePage = () => {
  const [reflections, setReflections] = useState([]);
  const [displayCount, setDisplayCount] = useState(12);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReflections = async () => {
      setIsLoading(true);
      try {
        const data = await fetchReflectionList();
        if (Array.isArray(data)) {
          const sortedData = data.sort((a, b) => b.id - a.id);
          setReflections(sortedData);
        } else {
          throw new Error("Data format mismatch");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReflections();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 12);
  };

  return (
    <Container>
      <WelcomeSection navigate={navigate} />
      {loading ? (
        <LoadingSection />
      ) : error ? (
        <ErrorSection error={error} />
      ) : (
        <ReflectionsGrid
          reflections={reflections}
          displayCount={displayCount}
        />
      )}
      {!loading && displayCount < reflections.length && (
        <LoadMoreButton onClick={handleLoadMore} />
      )}
      <ContactSection navigate={navigate} />
    </Container>
  );
};

const WelcomeSection = ({ navigate }) => (
  <Box textAlign="center" p={4}>
    <Typography variant="h3" gutterBottom>
      Hey there, I'm Raito
    </Typography>
    <Typography variant="h6" paragraph>
      Welcome to my corner of the web where I share my thoughts, projects, and
      ways to connect with me.
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate("/about")}
      aria-label="Learn more about me"
    >
      Learn More About Me
    </Button>
  </Box>
);

const LoadingSection = () => (
  <Box sx={{ display: "flex", justifyContent: "center", mx: 4, mb: 4 }}>
    <CircularProgress />
  </Box>
);

const ErrorSection = ({ error }) => (
  <Typography variant="h6" color="error" align="center">
    {error}
  </Typography>
);

const ReflectionsGrid = ({ reflections, displayCount }) => (
  <Grid container spacing={4}>
    {reflections.slice(0, displayCount).map((reflection) => (
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={reflection.id}>
        <ReflectionCard reflection={reflection} />
      </Grid>
    ))}
  </Grid>
);

const LoadMoreButton = ({ onClick }) => (
  <Box textAlign="center" mx={4} mb={4}>
    <Button
      variant="contained"
      onClick={onClick}
      aria-label="Load more reflections"
    >
      Load More
    </Button>
  </Box>
);

const ContactSection = ({ navigate }) => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" gutterBottom>
      Get in Touch
    </Typography>
    <Typography variant="body1" paragraph>
      Got any questions or feedback? I'd love to hear from you.
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate("/contact")}
      aria-label="Contact me"
    >
      Contact Me
    </Button>
  </Box>
);

export default HomePage;
