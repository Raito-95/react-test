import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
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

  useEffect(() => {
    const fetchCSRFToken = async () => {
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
    };

    fetchCSRFToken();
  }, []);

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
    <Box p={5}>
      <Typography variant="h4" gutterBottom>
        Get in Touch
      </Typography>
      {notification && (
        <Box my={2}>
          <Alert severity={notification.type}>{notification.message}</Alert>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={
              isSubmitting ||
              !formData.name ||
              !formData.email ||
              !formData.message
            }
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ContactPage;
