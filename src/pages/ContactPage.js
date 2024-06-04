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

const ContactPage = () => {
  const csrfToken = useContext(CSRFContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
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
    if (emailError || !csrfToken) {
      setNotification({
        type: "error",
        message: "Invalid email or missing token.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await submitContactForm(formData, csrfToken);
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
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </Stack>
  </form>
);

export default ContactPage;
