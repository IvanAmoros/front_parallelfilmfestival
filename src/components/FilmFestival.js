import React, { useState, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import MoviesToWatch from './MoviesToWatch';
import FilmsWatched from './FilmsWatched';
import { Typography, Button, Container, Box } from '@mui/material';
import { useAuth } from '../AuthContext';
import LoginModal from './LoginModal';

const FilmFestival = () => {
  const { isLoggedIn, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [shrinkHeader, setShrinkHeader] = useState(false);

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShrinkHeader(true);
      } else {
        setShrinkHeader(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container sx={{ px: 0 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#282c34',
          transition: 'all 0.5s ease',
          padding: shrinkHeader ? '8px 0' : '16px 0',
          //boxShadow: shrinkHeader ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: 'Lobster, cursive',
            fontSize: shrinkHeader ? '24px' : '45px',
            textAlign: 'center',
            color: 'white',
            transition: 'font-size 0.5s ease',
            cursor: 'pointer',
          }}
          onClick={handleRefresh}
        >
          Paral·lel Film Festival
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={isLoggedIn ? handleLogout : handleOpenLoginModal}
        sx={{
          mb: 2,
          backgroundColor: '#5CB6FF'
        }}
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
