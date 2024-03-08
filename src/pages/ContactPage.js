import React, { useState } from 'react';
import { Box, Typography, Stack, TextField, Button, Alert } from '@mui/material';

const BASE_API_URL = process.env.REACT_APP_API_BASE_URL;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [emailError, setEmailError] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' && !isValidEmail(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      setNotification({ type: 'error', message: 'Invalid email address.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_API_URL}submit_contact_form/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setNotification({ type: 'success', message: "Thanks for reaching out. We'll get back to you soon." });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setNotification({ type: 'error', message: 'Sorry, there was an issue sending your message.' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={5}>
      <Typography variant="h4" gutterBottom>Get in Touch</Typography>
      {notification && (
        <Box my={2}>
          <Alert severity={notification.type}>{notification.message}</Alert>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField name="name" variant="outlined" fullWidth label="Name" value={formData.name} onChange={handleInputChange} />
          <TextField name="email" variant="outlined" fullWidth label="Email" value={formData.email} onChange={handleInputChange} error={!!emailError} helperText={emailError} />
          <TextField name="message" variant="outlined" fullWidth multiline rows={6} label="Message" value={formData.message} onChange={handleInputChange} />
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={isSubmitting}>Submit</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ContactPage;
