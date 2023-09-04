import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    List, 
    TextField, 
    InputAdornment, 
    IconButton, 
    Grid, 
    Typography 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';
import ArrowRightTwoToneIcon from '@mui/icons-material/ArrowRightTwoTone';

import { 
    AnimeTitle, 
    YearButtonsContainer, 
    YearButton, 
    AnimeSeason, 
    AnimeListItem, 
    AnimeLink 
} from './Styles';

function Fun() {
  const [animeList, setAnimeList] = useState([]);
  const years = [...new Set(animeList.map(anime => anime.year))];
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    
    const fetchData = async () => {
      try {
        const response = await axios.get('https://Raito.pythonanywhere.com/api/anime_list/');
        setAnimeList(response.data);
        
        const years = [...new Set(response.data.map(anime => anime.year))];
        const newSelectedYearIndex = years.indexOf(currentYear);
        setSelectedYearIndex(newSelectedYearIndex !== -1 ? newSelectedYearIndex : 0);
      } catch (error) {
        console.error("Error fetching anime list:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleYearChange = (increment) => {
    const newIndex = selectedYearIndex + increment;
    if (newIndex >= 0 && newIndex < years.length) {
      setSelectedYearIndex(newIndex);
    }
  };

  const selectedYear = years[selectedYearIndex];
  const filteredAnime = animeList.filter(anime => 
    anime.name && typeof anime.name === 'string' && anime.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <AnimeTitle>Anime List</AnimeTitle>

      <TextField
        fullWidth
        type="text"
        variant="outlined"
        placeholder="Search for anime..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Grid container alignItems="center">
                <Grid item>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </InputAdornment>
          ),
        }}
      />

      {searchTerm ? (
        <List>
          {filteredAnime.map(anime => (
            <AnimeListItem key={anime.name}>
              <AnimeLink href={anime.url} title={anime.title} target="_blank" rel="noopener noreferrer">
                {anime.name}
              </AnimeLink>
            </AnimeListItem>
          ))}
        </List>
      ) : (
        <div>
          <YearButtonsContainer>
            <YearButton variant="outlined" onClick={() => handleYearChange(-1)}>
              <ArrowLeftTwoToneIcon fontSize="large" />
            </YearButton>

            <Typography>
              <AnimeSeason>{selectedYear}</AnimeSeason>
            </Typography>

            <YearButton variant="outlined" onClick={() => handleYearChange(1)}>
              <ArrowRightTwoToneIcon fontSize="large" />
            </YearButton>
          </YearButtonsContainer>

          {['Fall', 'Summer', 'Spring', 'Winter'].map(season => (
            <div key={season} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {animeList.filter(anime => anime.year === selectedYear && anime.season === season).length > 0 && (
                <div>
                  <Typography style={{ textAlign: 'center'}}>
                    <AnimeSeason>{season}</AnimeSeason>
                  </Typography>

                  <List>
                    {animeList.filter(anime => anime.year === selectedYear && anime.season === season).map(anime => (
                      <AnimeListItem key={anime.name}>
                        <AnimeLink href={anime.url} title={anime.title} target="_blank" rel="noopener noreferrer">
                          <Typography style={{ textAlign: 'center' }}>
                            {anime.name}
                          </Typography>
                        </AnimeLink>
                      </AnimeListItem>
                    ))}
                  </List>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Fun;
