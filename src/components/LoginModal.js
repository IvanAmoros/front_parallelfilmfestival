import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Alert } from '@mui/material';

const LoginModal = ({ open, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const error = await login(username, password);
    if (error) {
      setError(error);
    } else {
      onClose();
    }
  };

  const handleRegister = async () => {
    const error = await register(username, email, password);
    if (error) {
      setError(error);
    } else {
      await login(username, password);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isRegister) {
        handleRegister();
      } else {
        handleLogin();
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isRegister ? 'Register' : 'Login'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{JSON.stringify(error)}</Alert>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          fullWidth
          margin="dense"
        />
        {isRegister && (
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            fullWidth
            margin="dense"
          />
        )}
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={isRegister ? handleRegister : handleLogin} color="primary">
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </DialogActions>
      <Box textAlign="center" mb={2}>
        <Button onClick={toggleMode} color="secondary">
          {isRegister ? 'Ya tienes cuenta? Login' : "No tienes cuenta? Register"}
        </Button>
      </Box>
    </Dialog>
  );
};

export default LoginModal;