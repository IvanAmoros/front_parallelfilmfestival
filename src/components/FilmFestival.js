import React, { useState } from 'react';
import MovieSearch from './MovieSearch';
import MoviesToWatch from './MoviesToWatch';
import FilmsWatched from './FilmsWatched';
import { Typography, Button, Container } from '@mui/material';
import { useAuth } from '../AuthContext';
import LoginModal from './LoginModal';

const FilmFestival = () => {
  const { isLoggedIn, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <Container>
      <Typography variant="h1" component="h1">
        Paral·lel Film Festival
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={isLoggedIn ? logout : handleOpenLoginModal}
        sx={{ mb: 2 }}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </Button>
      <FilmsWatched />
      <MoviesToWatch />
      <MovieSearch />
      <LoginModal open={loginModalOpen} onClose={handleCloseLoginModal} />
    </Container>
  );
};

export default FilmFestival;
