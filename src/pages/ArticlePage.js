import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardActionArea,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash.debounce";
import { fetchArticleList } from "../services/api";

const BASE_IMAGE_URL = `${process.env.REACT_APP_API_BASE_URL}get_image/?`;

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

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
    } catch (err) {
      setError("Oops! Couldn't fetch the articles.");
      console.error("Error fetching articles:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  };

  const debouncedSearchCallback = useCallback(
    (term) => {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredArticles(filtered);
      setCurrentPage(1);
    },
    [articles]
  );

  const debouncedSearch = debounce(debouncedSearchCallback, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const preventImageDownload = (e) => {
    e.preventDefault();
  };

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

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
        paginatedArticles={paginatedArticles}
        handleOpenDialog={handleOpenDialog}
        preventImageDownload={preventImageDownload}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalArticles={filteredArticles.length}
        articlesPerPage={articlesPerPage}
        searchTerm={searchTerm}
        highlightSearchTerm={highlightSearchTerm}
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
  <Box sx={{ padding: 4 }}>
    <Typography variant="h4" gutterBottom>
      Articles
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Dive into a world of interesting reads. Explore, discover, and enjoy!
    </Typography>
  </Box>
);

const SearchSection = ({ searchTerm, setSearchTerm, debouncedSearch }) => (
  <Box sx={{ paddingX: 4, paddingBottom: 4 }}>
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
  paginatedArticles,
  handleOpenDialog,
  preventImageDownload,
  currentPage,
  setCurrentPage,
  totalArticles,
  articlesPerPage,
  searchTerm,
  highlightSearchTerm,
}) => (
  <Box sx={{ paddingX: 4 }}>
    {isLoading ? (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Typography variant="body1" color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    ) : paginatedArticles.length > 0 ? (
      <>
        <Grid container spacing={4}>
          {paginatedArticles.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ArticleCard
                article={article}
                handleOpenDialog={handleOpenDialog}
                preventImageDownload={preventImageDownload}
                searchTerm={searchTerm}
                highlightSearchTerm={highlightSearchTerm}
              />
            </Grid>
          ))}
        </Grid>
        <PaginationControls
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalArticles={totalArticles}
          articlesPerPage={articlesPerPage}
        />
      </>
    ) : (
      <Typography variant="body1" sx={{ padding: 2, textAlign: "center" }}>
        No articles found. Try searching for something else!
      </Typography>
    )}
  </Box>
);

const ArticleCard = ({
  article,
  handleOpenDialog,
  preventImageDownload,
  searchTerm,
  highlightSearchTerm,
}) => (
  <Card>
    <Box
      sx={{
        position: "relative",
        height: { xs: 150, sm: 200, md: 250 },
        overflow: "hidden",
      }}
      onContextMenu={preventImageDownload}
    >
      <img
        src={`${BASE_IMAGE_URL}image_id=${article.id}&type=article`}
        alt={article.title}
        style={{ width: "100%", objectFit: "contain" }}
        onDragStart={(e) => e.preventDefault()}
      />
    </Box>
    <CardActionArea onClick={() => handleOpenDialog(article)}>
      <Typography
        variant="h6"
        dangerouslySetInnerHTML={{
          __html: highlightSearchTerm(article.title, searchTerm),
        }}
        sx={{ padding: 1 }}
      />
      <Typography variant="body2" sx={{ padding: 1 }} color="textSecondary">
        {new Date(article.date).toLocaleDateString()}
      </Typography>
    </CardActionArea>
  </Card>
);

const PaginationControls = ({
  currentPage,
  setCurrentPage,
  totalArticles,
  articlesPerPage,
}) => {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
      <Button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Typography sx={{ marginX: 2 }}>
        Page {currentPage} of {totalPages}
      </Typography>
      <Button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </Box>
  );
};

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
