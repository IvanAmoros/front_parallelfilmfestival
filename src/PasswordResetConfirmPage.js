import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import api from './utils/api';

const PasswordResetConfirmPage = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${apiUrl}/base/reset-confirm/${uid}/${token}/`, { new_password: newPassword });
      setMessage('Password has been reset. You can now log in.');
      setError('');
    } catch (err) {
      setError('Failed to reset password.');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Reset Password
      </Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!message && (
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained">
            Reset Password
          </Button>
        </form>
      )}
    </Container>
  );
};

export default PasswordResetConfirmPage;

