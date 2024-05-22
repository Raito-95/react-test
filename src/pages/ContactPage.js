import React, { useState, useEffect, useCallback } from "react";
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

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [csrfToken, setCSRFToken] = useState("");
  const [emailError, setEmailError] = useState("");
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCSRFToken = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_API_URL}get_csrf_token/`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      const data = await response.json();
      setCSRFToken(data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  }, []);

  useEffect(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

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
    if (emailError || !csrfToken) {
      setNotification({
        type: "error",
        message: "Invalid email address or missing CSRF token.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_API_URL}submit_contact_form/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Thanks for reaching out. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setNotification({
          type: "error",
          message: "Sorry, there was an issue sending your message.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Error occurred. Please try again later.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <HeaderSection />
      <NotificationSection notification={notification} />
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

const NotificationSection = ({ notification }) =>
  notification && (
    <Box my={4}>
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
    <Stack spacing={4}>
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting || !!emailError}
        aria-label="Submit"
        endIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
      >
        Submit
      </Button>
    </Stack>
  </form>
);

export default ContactPage;
