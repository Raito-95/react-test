import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { submitContactForm } from "../services/api";
import { CSRFContext } from "../index";

const useContactForm = (initialData) => {
  const { csrfToken, loading } = useContext(CSRFContext);
  const [formData, setFormData] = useState(initialData);
  const [emailError, setEmailError] = useState("");
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email format"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !csrfToken || loading) {
      setNotification({
        type: "error",
        message: "Invalid email, missing token, or token is loading.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      setNotification({
        type: "success",
        message: "Thanks for reaching out! We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    emailError,
    notification,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    loading,
  };
};

const ContactPage = () => {
  const {
    formData,
    emailError,
    notification,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    loading,
  } = useContactForm({ name: "", email: "", message: "" });

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading form...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <HeaderSection />
      {notification && <NotificationSection notification={notification} />}
      <ContactForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        emailError={emailError}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

const HeaderSection = () => (
  <Box mb={4}>
    <Typography variant="h4" gutterBottom>
      Get in Touch
    </Typography>
  </Box>
);

const NotificationSection = ({ notification }) => (
  <Box my={2}>
    <Alert severity={notification.type}>{notification.message}</Alert>
  </Box>
);

const ContactForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  emailError,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <Stack spacing={3}>
      <TextField
        name="name"
        label="Name"
        variant="outlined"
        fullWidth
        value={formData.name}
        onChange={handleInputChange}
        required
      />
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        fullWidth
        value={formData.email}
        onChange={handleInputChange}
        error={!!emailError}
        helperText={emailError}
        required
      />
      <TextField
        name="message"
        label="Message"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        value={formData.message}
        onChange={handleInputChange}
        required
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting || !!emailError}
          endIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Stack>
  </form>
);

export default ContactPage;
