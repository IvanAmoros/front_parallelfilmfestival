import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import api from './utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${apiUrl}/base/api/password-reset/`, { email });
      setMessage('If the email exists, a reset link has been sent.');
      setError('');
    } catch (err) {
      setError('Failed to send reset email.');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Forgot Password
      </Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained">
          Send Reset Link
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPasswordPage;
