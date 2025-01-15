import React, { useState, useEffect, useMemo } from "react";
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

const useFetchReflections = (initialReflections = []) => {
  const [reflections, setReflections] = useState(initialReflections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReflections = async () => {
    setLoading(true);
    try {
      const data = await fetchReflectionList();
      if (Array.isArray(data)) {
        setReflections(data.sort((a, b) => b.id - a.id));
        setError(null);
      } else {
        throw new Error("Invalid data format received from the server.");
      }
    } catch (err) {
      if (err.message.includes("Network Error")) {
        setError("Network error occurred. Please check your connection.");
      } else {
        setError(err.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReflections();
  }, []);

  return { reflections, loading, error, reload: loadReflections };
};

const LoadingIndicator = ({ isLoading }) =>
  isLoading && (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <CircularProgress size={24} />
    </Box>
  );

const ErrorSection = ({ error, onRetry }) => (
  <Box textAlign="center" sx={{ my: 4 }}>
    <Typography variant="h6" color="error">
      {error || "An unknown error occurred. Please try again later."}
    </Typography>
    {onRetry && (
      <Button
        onClick={onRetry}
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    )}
  </Box>
);

const ReflectionsGrid = ({ reflections, isLoading }) => (
  <Box>
    <Grid container spacing={4} sx={{ mb: 4 }}>
      {reflections.map((reflection) => (
        <Grid item xs={12} sm={6} md={4} key={reflection.id}>
          <ReflectionCard reflection={reflection} />
        </Grid>
      ))}
    </Grid>
    {!isLoading && reflections.length === 0 && (
      <Typography align="center" color="textSecondary" sx={{ my: 4 }}>
        No reflections available. Please check back later!
      </Typography>
    )}
  </Box>
);

const LoadMoreButton = ({ onClick, isLoading, disabled }) => (
  <Box textAlign="center" my={4}>
    <Button
      variant="contained"
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-label="Load more reflections"
    >
      {isLoading ? "Loading..." : "Load More"}
    </Button>
    <LoadingIndicator isLoading={isLoading} />
  </Box>
);

const WelcomeSection = ({ navigate }) => (
  <Box textAlign="center" mb={4}>
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

const ContactSection = ({ navigate }) => (
  <Box textAlign="center" py={4}>
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

const HomePage = () => {
  const { reflections, loading, error, reload } = useFetchReflections();
  const [displayCount, setDisplayCount] = useState(12);
  const navigate = useNavigate();

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 12, reflections.length));
  };

  const visibleReflections = useMemo(
    () => reflections.slice(0, displayCount),
    [reflections, displayCount]
  );

  return (
    <Container sx={{ py: 4 }}>
      <WelcomeSection navigate={navigate} />
      {error ? (
        <ErrorSection error={error} onRetry={reload} />
      ) : loading && reflections.length === 0 ? (
        <LoadingIndicator isLoading={loading} />
      ) : (
        <ReflectionsGrid reflections={visibleReflections} isLoading={loading} />
      )}
      {!loading && displayCount < reflections.length && (
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={loading}
          disabled={displayCount >= reflections.length}
        />
      )}
      <ContactSection navigate={navigate} />
    </Container>
  );
};

export default HomePage;
