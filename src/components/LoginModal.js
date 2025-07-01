import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Typography, Dialog, DialogContent, DialogActions, TextField, Button, Box, Alert} from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';

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
    if (!username) {
      setError('Username is required');
      return;
    }
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    const error = await register(username, email, password);
    if (error) {
      setError(error);
    } else {
      await login(username, password);
      onClose();
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      isRegister ? handleRegister() : handleLogin();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'xs'}>
      <DialogContent>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mb: 2 }}
        >
          {isRegister ? 'Register' : 'Sign in'}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
          fullWidth
          margin="dense"
          required
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
            required
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
          required
        />
        <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={isRegister ? handleRegister : handleLogin}
              sx={{ mt: 2 }}
            >
              {isRegister ? 'Register' : 'Sign in'}
            </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
      <Box textAlign="center" mb={2}>
        <Button onClick={toggleMode} color="secondary">
          {isRegister ? 'Ya tienes cuenta? Login' : "No tienes cuenta? Register"}
        </Button>
        {/* {!isRegister && (
          <Box mt={1}>
            <Link component={RouterLink} to="/forgot-password" underline="hover">
              Forgot password?
            </Link>
          </Box>
        )} */}
      </Box>
    </Dialog>
  );
};

export default LoginModal;
