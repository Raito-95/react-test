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
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash.debounce";

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_IMAGE_URL = `${BASE_API_URL}get_image/?image_name=`;

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_API_URL}article_list/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => b.id - a.id);
      setArticles(sortedData);
      setFilteredArticles(sortedData);
    } catch (error) {
      setError("Error fetching articles.");
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
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
      <HeaderSection />
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        debouncedSearch={debouncedSearch}
      />
      <ContentSection
        isLoading={isLoading}
        error={error}
        filteredArticles={filteredArticles}
        handleOpenDialog={handleOpenDialog}
      />
      <ArticleDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedArticle={selectedArticle}
        formatDialogContent={formatDialogContent}
      />
    </Container>
  );
};

const HeaderSection = () => (
  <Box p={4}>
    <Typography variant="h4" gutterBottom>
      Articles
    </Typography>
  </Box>
);

const SearchSection = ({ searchTerm, setSearchTerm, debouncedSearch }) => (
  <Box px={4} pb={4}>
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
);

const ContentSection = ({
  isLoading,
  error,
  filteredArticles,
  handleOpenDialog,
}) => (
  <Box px={4}>
    {isLoading ? (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Typography variant="body1" color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    ) : filteredArticles.length > 0 ? (
      <Grid container spacing={4}>
        {filteredArticles.map((article, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardActionArea onClick={() => handleOpenDialog(article)}>
                <CardMedia
                  component="img"
                  image={`${BASE_IMAGE_URL}article_${article.id}.webp`}
                  alt={article.title}
                  sx={{
                    height: {
                      xs: 150,
                      sm: 200,
                      md: 250,
                      lg: 300,
                      xl: 350,
                    },
                    objectFit: "contain",
                  }}
                />

                <CardContent>
                  <Typography variant="h6" noWrap>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(article.date).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {article.summary}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Typography variant="body1" sx={{ padding: 2, textAlign: "center" }}>
        No articles found.
      </Typography>
    )}
  </Box>
);

const ArticleDialog = ({
  openDialog,
  setOpenDialog,
  selectedArticle,
  formatDialogContent,
}) => (
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
);

export default ArticlePage;
