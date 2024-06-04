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
import { fetchArticleList } from "../services/api";

const BASE_IMAGE_URL = `${process.env.REACT_APP_API_BASE_URL}get_image/?`;

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
      const data = await fetchArticleList();
      const sortedData = data.sort((a, b) => b.id - a.id);
      setArticles(sortedData);
      setFilteredArticles(sortedData);
    } catch (error) {
      setError("Oops! Couldn't fetch the articles.");
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

  const preventImageDownload = (e) => {
    e.preventDefault();
  };

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
        preventImageDownload={preventImageDownload}
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
    <Typography variant="body1" color="textSecondary">
      Dive into a world of interesting reads. Explore, discover, and enjoy!
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
  preventImageDownload,
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
      <Grid>
        {filteredArticles.map((article, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardActionArea onClick={() => handleOpenDialog(article)}>
                <Box
                  sx={{
                    position: "relative",
                    height: {
                      xs: 150,
                      sm: 200,
                      md: 250,
                      lg: 300,
                      xl: 350,
                    },
                    overflow: "hidden",
                  }}
                  onContextMenu={preventImageDownload}
                >
                  <CardMedia
                    component="img"
                    image={`${BASE_IMAGE_URL}image_id=${article.id}&type=article`}
                    alt={article.title}
                    sx={{
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.001)",
                    }}
                  ></Box>
                </Box>
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
        No articles found. Try searching for something else!
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
