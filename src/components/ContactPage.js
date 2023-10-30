import React, { useState } from 'react';
import {
   Box, 
   Typography, 
   Stack, 
   TextField, 
   Button, 
   Alert 
} from '@mui/material';
import getCSRFToken from './csrfToken';

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const ContactPage = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Message: '',
  });

  // State to manage email validation error and notifications
  const [emailError, setEmailError] = useState("");
  const [notification, setNotification] = useState(null);

   // Validate email format
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Update form data based on user input
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate email format
    if (name === "Email" && !isValidEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure email is valid
    if (emailError) {
      setNotification({ type: 'error', message: "Invalid email address." });
      return;
    }
  
    // Fetch and set CSRF token
    const csrfToken = getCSRFToken();

    // Debugging step: Log all cookies (This should be removed in a production environment!)
    document.addEventListener("DOMContentLoaded", function() {
      const printAllCookies = () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          console.log(cookies[i].trim());
        }
      };
    
      printAllCookies();
    });

    // Handle CSRF token errors
    if (!csrfToken) {
      setNotification({ type: 'error', message: "Unable to get security token. Please try again later." });
      return;
    }
  
    // Send form data to server
    try {
      const response = await fetch(`${BASE_API_URL}submit_contact_form/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
        credentials: 'include', 
      });
    
      // Handle server response
      if (response.ok) {
        setNotification({ type: 'success', message: "Thanks for reaching out. We'll get back to you soon." });
        setFormData({ Name: '', Email: '', Message: '' });
      } else {
        setNotification({ type: 'error', message: "Sorry, there was an issue sending your message." });
      }
    } catch (error) {
      setNotification({ type: 'error', message: "Error occurred. Please try again later." });
    }
  };

  return (
    <Box p={5}>
      <Typography variant="h4" gutterBottom>
        Get in Touch
      </Typography>

      {notification && (
        <Box my={2}>
          <Alert severity={notification.type}>
            {notification.message}
          </Alert>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="Name"
            variant="outlined"
            fullWidth
            label="Name"
            value={formData.Name}
            onChange={handleInputChange}
          />
          <TextField
            name="Email"
            variant="outlined"
            fullWidth
            label="Email"
            value={formData.Email}
            onChange={handleInputChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            name="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            label="Message"
            value={formData.Message}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ContactPage;
