import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReflectionCard from "../components/ReflectionCard";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const HomePage = () => {
  const [reflections, setReflections] = useState([]);
  const [displayCount, setDisplayCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReflections = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}reflection_list/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
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

    fetchReflections();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 9);
  };

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Box py={4} textAlign="center">
        <Typography variant="h2" gutterBottom>
          Whispers of the Heart
        </Typography>
        <Typography variant="h5" paragraph>
          A symphony of thoughts, dreams, and musings.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/about")}
        >
          Dive Into My Journey
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {reflections.slice(0, displayCount).map((reflection) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={reflection.id}>
              <ReflectionCard reflection={reflection} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && displayCount < reflections.length && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}

      <Box py={5} textAlign="center">
        <Typography variant="h3" gutterBottom>
          Share in the Echoes
        </Typography>
        <Typography variant="h6" paragraph>
          Have stories of your own? Let's weave our tales together.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/contact")}
        >
          Connect with Me
        </Button>
      </Box>
    </>
  );
};

export default HomePage;
