import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAnimeList } from "../services/api";

const categoryOrder = ["Fall", "Summer", "Spring", "Winter", "Movie"];

const AnimePage = () => {
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [animeData, setAnimeData] = useState({
    list: [],
    year: new Date().getFullYear(),
    minYear: 0,
    maxYear: new Date().getFullYear(),
  });
  const [imageStyles, setImageStyles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnimeList();
      const sortedList = data.sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }
        return (
          categoryOrder.indexOf(b.category) - categoryOrder.indexOf(a.category)
        );
      });

      const latestYear = sortedList[0]?.year || new Date().getFullYear();
      const earliestYear =
        sortedList[sortedList.length - 1]?.year || latestYear;

      const styles = {};
      await Promise.all(
        sortedList.map(
          (anime) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                const isPortrait = img.height > img.width;
                const aspectRatio = img.width / img.height;
                const height = isPortrait ? "300px" : `${300 / aspectRatio}px`;
                styles[anime.url] = {
                  height: height,
                  width: "100%",
                };
                resolve();
              };
              img.src = anime.image_url;
            })
        )
      );

      setAnimeData({
        list: sortedList,
        year: latestYear,
        minYear: earliestYear,
        maxYear: latestYear,
      });
      setFilteredAnimes(
        sortedList
          .filter((anime) => anime.year === latestYear)
          .map((anime) => ({
            ...anime,
            showTitle: false,
          }))
      );
      setImageStyles({ ...styles });
    } catch (error) {
      setError("Uh-oh! Something went wrong while fetching the anime list.");
      console.error("Error fetching anime list:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData]);

  useEffect(() => {
    const filtered = animeData.list
      .filter((anime) => anime.year === animeData.year)
      .map((anime) => ({
        ...anime,
        showTitle: false,
      }));
    setFilteredAnimes(filtered);
  }, [animeData]);

  const handleYearFilter = useCallback(
    (selectedYear) => {
      const filtered = animeData.list
        .filter((anime) => anime.year === selectedYear)
        .map((anime) => ({
          ...anime,
          showTitle: false,
        }));
      setFilteredAnimes(filtered);
    },
    [animeData.list]
  );

  const handleSearch = useCallback(
    (term) => {
      if (term) {
        const filtered = animeData.list
          .filter((anime) =>
            anime.name.toLowerCase().includes(term.toLowerCase())
          )
          .map((anime) => ({
            ...anime,
            showTitle: false,
          }));
        setFilteredAnimes(filtered);
      } else {
        handleYearFilter(animeData.year);
      }
    },
    [animeData, handleYearFilter]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const yearOptions = useMemo(() => {
    return Array.from(
      { length: animeData.maxYear - animeData.minYear + 1 },
      (_, i) => animeData.maxYear - i
    );
  }, [animeData.maxYear, animeData.minYear]);

  const toggleShowTitle = (url) => {
    setFilteredAnimes((prev) =>
      prev.map((anime) =>
        anime.url === url ? { ...anime, showTitle: !anime.showTitle } : anime
      )
    );
  };

  return (
    <Container maxWidth="lg">
      <HeaderSection />
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        animeData={animeData}
        setAnimeData={setAnimeData}
        handleSearch={handleSearch}
        handleYearFilter={handleYearFilter}
        yearOptions={yearOptions}
      />
      <ContentSection
        loading={loading}
        error={error}
        filteredAnimes={filteredAnimes}
        imageStyles={imageStyles}
        toggleShowTitle={toggleShowTitle}
      />
    </Container>
  );
};

const HeaderSection = () => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" gutterBottom>
      Anime Chronicles
    </Typography>
    <Typography variant="body1" color="textSecondary" paragraph>
      Dive into the colorful world of anime with me. Discover new shows, relive
      old favorites, and explore together!
    </Typography>
  </Box>
);

const SearchSection = ({
  searchTerm,
  setSearchTerm,
  animeData,
  setAnimeData,
  handleSearch,
  handleYearFilter,
  yearOptions,
}) => (
  <Grid container alignItems="center" spacing={2} px={{ xs: 2, sm: 4 }}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for anime..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={() => handleSearch(searchTerm)}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <Select
          value={animeData.year}
          onChange={(e) => {
            const newYear = e.target.value;
            setAnimeData((prev) => ({ ...prev, year: newYear }));
            handleYearFilter(newYear);
          }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {yearOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  </Grid>
);

const ContentSection = ({
  loading,
  error,
  filteredAnimes,
  imageStyles,
  toggleShowTitle,
}) => (
  <Box p={4}>
    {loading ? (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
        {error}
      </Typography>
    ) : filteredAnimes.length === 0 ? (
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        No anime found. Try searching something else!
      </Typography>
    ) : (
      categoryOrder.map((category) => {
        const animesForCategory = filteredAnimes.filter(
          (anime) => anime.category === category
        );
        if (animesForCategory.length === 0) return null;

        return (
          <div key={category}>
            <Typography
              variant="h4"
              align="center"
              sx={{ marginTop: "2em", marginBottom: "1em" }}
            >
              {category}
            </Typography>
            <Grid container spacing={2}>
              {animesForCategory.map((anime) => (
                <Grid
                  key={anime.url}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ minHeight: "300px" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      backgroundImage: "none",
                      boxShadow: '1px 2px 9px #ADD8E6',
                    }}
                  >
                    <Box
                      sx={{
                        padding: "16px",
                      }}
                    >
                      <Box
                        component="a"
                        href={anime.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "block",
                          textDecoration: "none",
                          height: "300px",
                          ...imageStyles[anime.url],
                          backgroundImage: `url(${anime.image_url})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        onClick={() => toggleShowTitle(anime.url)}
                        sx={{ cursor: "pointer" }}
                      >
                        {anime.showTitle ? anime.title : anime.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        );
      })
    )}
  </Box>
);

export default AnimePage;
