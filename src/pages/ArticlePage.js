import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import debounce from "lodash.debounce";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

function ArticlePage() {
  const theme = useTheme();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = useCallback(() => {
    setIsLoading(true);
    fetch(`${BASE_API_URL}article_list/`)
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setFilteredArticles(data);
      })
      .catch((error) => console.error("Error fetching articles:", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const debouncedSearchCallback = useCallback(
    (term) => {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredArticles(filtered);
    },
    [articles]
  );

  const debouncedSearch = debounce(debouncedSearchCallback, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleOpenDialog = useCallback((article) => {
    setSelectedArticle(article);
    setOpenDialog(true);
  }, []);

  const formatDialogContent = useCallback((content) => {
    if (!content) return null;
    return content.split("\n").map((text, index) => (
      <Typography key={index} paragraph>
        {text}
      </Typography>
    ));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ padding: 2 }}>
      <Box pt={4} pb={4}>
        <Typography variant="h4" gutterBottom>
          Articles
        </Typography>

        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => debouncedSearch(searchTerm)}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <Grid item xs={12} key={index} sx={{ padding: 2 }}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 140, height: 140 }}
                      image={article.image_url}
                      alt={article.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{
                          [theme.breakpoints.down("sm")]: {
                            whiteSpace: "normal",
                          },
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        {new Date(article.date).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {article.summary}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleOpenDialog(article)}
                        sx={{ mt: 1 }}
                      >
                        More...
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ padding: 2 }}>
                No articles found.
              </Typography>
            )}
          </Grid>
        )}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="article-dialog-title"
          aria-describedby="article-dialog-description"
        >
          <DialogTitle id="article-dialog-title">
            {selectedArticle?.title}
          </DialogTitle>
          <DialogContent>
            {formatDialogContent(selectedArticle?.content)}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ArticlePage;
