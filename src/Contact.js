import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Snackbar } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    userEmail: '',
    message: '',
    csrfmiddlewaretoken: '',
  });
  const [emailError, setEmailError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userEmail") {
      if (validateEmail(value)) {
        setEmailError("");
      } else {
        setEmailError("Invalid email format");
      }
    }

    setFormData(prevState => ({ ...prevState, [name]: value || '' }));
  };

  const getCookie = (name) => {
    const cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) {
      alert("Please enter a valid email before submitting.");
      return;
    }

    try {
      const csrfToken = getCookie('csrftoken');
      formData.csrfmiddlewaretoken = csrfToken;

      const response = await fetch('https://Raito.pythonanywhere.com/submit_contact_form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setSubmissionStatus('success');
        console.log('Form data submitted successfully');
        setFormData({ name: '', userEmail: '', message: '', csrfmiddlewaretoken: csrfToken });
        setOpenSnackbar(true);
      } else {
        setSubmissionStatus('error');
        console.error('Failed to submit form data');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error submitting form data:', error);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Contact Me
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="userEmail"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Your Email"
          value={formData.userEmail}
          onChange={handleChange}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          name="message"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          multiline
          rows={4}
          label="Message"
          value={formData.message}
          onChange={handleChange}
        />
        <input
          type="hidden"
          name="csrfmiddlewaretoken"
          value={formData.csrfmiddlewaretoken}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Send Message
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={
          submissionStatus === 'success'
            ? 'Message sent successfully!'
            : 'Error sending message. Please try again later.'
        }
        action={
          <Button color="secondary" size="small" onClick={() => setOpenSnackbar(false)}>
            Close
          </Button>
        }
      />
    </Container>
  );
};

export default Contact;
