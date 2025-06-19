import React, { useState, useEffect } from 'react';
import MovieSearch from './MovieSearch';
import MoviesToWatch from './MoviesToWatch';
import FilmsWatched from './FilmsWatched';
import { Button, Container, Box } from '@mui/material';
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

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  useEffect(() => {

    window.scrollTo(0, 0);

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
          p: 1
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backgroundColor: '#282c34',
            transition: 'all 0.5s ease',
            p: 1,
            textAlign: 'center'
          }}
        >
          <Box
            component="img"
            src="images/banner.png"
            alt="Paral·lel Film Festival"
            sx={{
              maxHeight: '130px',



              cursor: 'pointer',
            }}
            onClick={handleRefresh}
          />
        </Box>
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