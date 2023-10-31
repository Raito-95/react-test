import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Container, 
    Grid, 
    Typography, 
    TextField, 
    IconButton, 
    InputAdornment, 
    Card, 
    CardContent, 
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL + 'anime_list/';
const seasonOrder = ['Fall', 'Summer', 'Spring', 'Winter'];

function AnimePage() {
  // States for the filtered animes and search term
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial anime data setup
  const [animeData, setAnimeData] = useState({
    list: [],
    year: new Date().getFullYear(),
    minYear: 0,
    maxYear: new Date().getFullYear()
  });

  // Fetch anime list on component mount
  useEffect(() => {
    axios.get(BASE_API_URL)
      .then(response => {
        const sortedList = response.data.sort((a, b) => {
          if (a.year !== b.year) {
            return b.year - a.year;
          }
          return seasonOrder.indexOf(b.season) - seasonOrder.indexOf(a.season);
        });

        const latestYear = sortedList[0]?.year || new Date().getFullYear();
        const earliestYear = sortedList[sortedList.length - 1]?.year || latestYear;
        
        const filtered = sortedList.filter(anime => anime.year === latestYear);
        
        setAnimeData({
          list: sortedList,
          year: latestYear,
          minYear: earliestYear,
          maxYear: latestYear
        });
        setFilteredAnimes(filtered);
      })
      .catch(error => console.error("Error fetching anime list:", error));
  }, []);

  // Update the filtered animes based on the year
  useEffect(() => {
    if (animeData.list.length) {
      const filtered = animeData.list.filter(anime => anime.year === animeData.year);
      setFilteredAnimes(filtered);
    }
  }, [animeData]);

  // Filter animes based on the selected year
  const handleYearFilter = useCallback((selectedYear) => {
    const filtered = animeData.list.filter(anime => anime.year === selectedYear);
    setFilteredAnimes(filtered);
  }, [animeData.list]);

  // Filter animes based on the search term
  const handleSearch = useCallback((term) => {
    if (term) {
        const filtered = animeData.list.filter(anime => 
            anime.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredAnimes(filtered);
    } else {
        handleYearFilter(animeData.year);
    }
  }, [animeData, handleYearFilter]);

  // Watch for changes in the search term and apply filtering
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, animeData, handleSearch]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Anime Chronicles</Typography>
      
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        A journey through the vibrant world of anime. Discover, reminisce, and explore with me.
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for anime..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container justifyContent="space-between">
            <IconButton 
              onClick={() => { 
                if(animeData.year > animeData.minYear) {
                  const newYear = animeData.year - 1;
                  setAnimeData(prev => ({ ...prev, year: newYear }));
                  handleYearFilter(newYear);
                }
              }}
              disabled={animeData.year === animeData.minYear}
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Chip label={animeData.year} color="primary" />
            <IconButton 
              onClick={() => { 
                if(animeData.year < animeData.maxYear) {
                  const newYear = animeData.year + 1;
                  setAnimeData(prev => ({ ...prev, year: newYear }));
                  handleYearFilter(newYear);
                }
              }}
              disabled={animeData.year === animeData.maxYear}
            >
              <NavigateNextIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      {seasonOrder.map(season => {
        const animesForSeason = filteredAnimes.filter(anime => anime.season === season);
        if (animesForSeason.length === 0) return null;

        return (
          <div key={season}>
            <Typography variant="h4" align="center" style={{ marginTop: '2em', marginBottom: '1em' }}>
              {season}
            </Typography>
            <Grid container spacing={3} style={{ marginTop: 20 }}>
              {animesForSeason.map(anime => (
                <Grid key={anime.name} item xs={12} sm={6} md={4} lg={3}>
                  <Card component="a" href={anime.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                          style={{
                              height: '180px',
                              width: '100%',
                              backgroundImage: `url(${anime.image_url})`,
                              backgroundSize: 'contain',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
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
      })}
    </Container>
  );
}

export default AnimePage;
