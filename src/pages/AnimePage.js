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
  useMediaQuery,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isXs = useMediaQuery("(max-width: 600px)");
  const isSm = useMediaQuery("(min-width: 601px) and (max-width: 960px)");
  const isMd = useMediaQuery("(min-width: 961px) and (max-width: 1280px)");
  const isLg = useMediaQuery("(min-width: 1281px) and (max-width: 1920px)");

  const getGridItemSize = () => {
    if (isXs) return 12;
    if (isSm) return 6;
    if (isMd) return 4;
    if (isLg) return 3;
    return 2;
  };

  const fetchAnimeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnimeList();
      const sortedList = data
        .map((anime) => ({
          ...anime,
          showTitle: false,
        }))
        .sort((a, b) => {
          if (a.year !== b.year) {
            return b.year - a.year;
          }
          return (
            categoryOrder.indexOf(b.category) -
            categoryOrder.indexOf(a.category)
          );
        });

      const latestYear = sortedList[0]?.year || new Date().getFullYear();
      const earliestYear =
        sortedList[sortedList.length - 1]?.year || latestYear;

      setAnimeData({
        list: sortedList,
        year: latestYear,
        minYear: earliestYear,
        maxYear: latestYear,
      });

      setFilteredAnimes(
        sortedList.filter((anime) => anime.year === latestYear)
      );
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

  const handleYearFilter = useCallback(
    (selectedYear) => {
      const filtered = animeData.list.filter(
        (anime) => anime.year === selectedYear
      );
      setFilteredAnimes(filtered);
    },
    [animeData.list]
  );

  const handleSearch = useCallback(
    (term) => {
      const filtered = animeData.list.filter((anime) =>
        anime.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredAnimes(filtered);
    },
    [animeData.list]
  );

  const toggleTitleDisplay = useCallback((anime) => {
    setFilteredAnimes((prev) =>
      prev.map((item) =>
        item.url === anime.url ? { ...item, showTitle: !item.showTitle } : item
      )
    );
  }, []);

  const yearOptions = useMemo(() => {
    return Array.from(
      { length: animeData.maxYear - animeData.minYear + 1 },
      (_, i) => animeData.maxYear - i
    );
  }, [animeData.maxYear, animeData.minYear]);

  return (
    <Container maxWidth="lg">
      <HeaderSection />
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        animeData={animeData}
        handleSearch={handleSearch}
        handleYearFilter={handleYearFilter}
        yearOptions={yearOptions}
      />
      <ContentSection
        loading={loading}
        error={error}
        filteredAnimes={filteredAnimes}
        getGridItemSize={getGridItemSize}
        toggleTitleDisplay={toggleTitleDisplay}
      />
    </Container>
  );
};

const HeaderSection = () => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" gutterBottom>
      Anime Chronicles
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Explore anime by year, season, and category. Discover your favorites!
    </Typography>
  </Box>
);

const SearchSection = ({
  searchTerm,
  setSearchTerm,
  animeData,
  handleSearch,
  handleYearFilter,
  yearOptions,
}) => (
  <Box display="flex" justifyContent="space-between" mb={4}>
    <TextField
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
      fullWidth
    />
    <FormControl sx={{ minWidth: 120, ml: 2 }}>
      <Select
        value={animeData.year}
        onChange={(e) => handleYearFilter(e.target.value)}
        displayEmpty
      >
        {yearOptions.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

const ContentSection = ({
  loading,
  error,
  filteredAnimes,
  getGridItemSize,
  toggleTitleDisplay,
}) => (
  <Box>
    {loading ? (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Typography color="error" align="center">
        {error}
      </Typography>
    ) : filteredAnimes.length === 0 ? (
      <Typography align="center">No anime found.</Typography>
    ) : (
      categoryOrder.map((category) => {
        const animesForCategory = filteredAnimes.filter(
          (anime) => anime.category === category
        );
        if (animesForCategory.length === 0) return null;

        return (
          <Box key={category} mb={4}>
            <Typography variant="h5" align="center" sx={{ mt: 3, mb: 2 }}>
              {category}
            </Typography>
            <Grid container spacing={3}>
              {animesForCategory.map((anime) => (
                <Grid item xs={getGridItemSize()} key={anime.url}>
                  <Card
                    onClick={() => toggleTitleDisplay(anime)}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <img
                      src={anime.image_url}
                      alt={anime.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" align="center">
                        {anime.showTitle ? anime.title : anime.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })
    )}
  </Box>
);

export default AnimePage;
