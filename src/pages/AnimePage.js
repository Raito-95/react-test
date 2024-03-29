import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;
const seasonOrder = ["Fall", "Summer", "Spring", "Winter"];

function AnimePage() {
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [animeData, setAnimeData] = useState({
    list: [],
    year: new Date().getFullYear(),
    minYear: 0,
    maxYear: new Date().getFullYear(),
  });

  const fetchAnimeList = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}anime_list/`);
      const sortedList = response.data.sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }
        return seasonOrder.indexOf(b.season) - seasonOrder.indexOf(a.season);
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
      console.error("Error fetching anime list:", error);
    }
  }, []);

  useEffect(() => {
    fetchAnimeList();
  }, [fetchAnimeList]);

  useEffect(() => {
    const filtered = animeData.list.filter(
      (anime) => anime.year === animeData.year
    );
    setFilteredAnimes(filtered);
  }, [animeData]);

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
      if (term) {
        const filtered = animeData.list.filter((anime) =>
          anime.name.toLowerCase().includes(term.toLowerCase())
        );
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Anime Chronicles
      </Typography>

      <Typography variant="subtitle1" color="textSecondary" paragraph>
        A journey through the vibrant world of anime. Discover, reminisce, and
        explore with me.
      </Typography>

      <Grid container spacing={3} alignItems="center">
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

      {filteredAnimes.length === 0 ? (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No animes found.
        </Typography>
      ) : (
        seasonOrder.map((season) => {
          const animesForSeason = filteredAnimes.filter(
            (anime) => anime.season === season
          );
          if (animesForSeason.length === 0) return null;

          return (
            <div key={season}>
              <Typography
                variant="h4"
                align="center"
                sx={{ marginTop: "2em", marginBottom: "1em" }}
              >
                {season}
              </Typography>
              <Grid container spacing={3}>
                {animesForSeason.map((anime) => (
                  <Grid
                    key={anime.url}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={3}
                  >
                    <Card
                      component="a"
                      href={anime.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          height: "200px",
                          width: "100%",
                          backgroundImage: `url(${anime.image_url})`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <CardContent>
                        <Typography variant="subtitle1" align="center">
                          {anime.name}
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
    </Container>
  );
}

export default AnimePage;
