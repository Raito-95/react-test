import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

function ArticlePage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    fetch(`${BASE_API_URL}articles/`)
      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error("Error fetching articles:", error));
  }, []);

  useEffect(() => {
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Articles
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredArticles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt="Article Image"
                height="140"
                image={article.imageUrl}
                title={article.title}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {article.title}
                </Typography>
                <Typography variant="body2">
                  {article.summary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ArticlePage;
