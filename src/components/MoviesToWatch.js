import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const api_url = process.env.REACT_APP_API_URL;

const MoviesToWatch = () => {
  const [moviesToWatch, setMoviesToWatch] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFilmId, setSelectedFilmId] = useState(null);



  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://${api_url}/film-festival/films-to-watch/`);
        setMoviesToWatch(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovies();
  }, []);

  const increaseUpVotes = async (filmId) => {
    try {
      const votedMovie = moviesToWatch.find(movie => movie.id === filmId);
      setSnackbarMessage(`Has votado a: ${votedMovie.tittle}`);
      setSnackbarOpen(true);
      const updatedMovies = moviesToWatch.map(movie => {
        if (movie.id === filmId) {
          return { ...movie, up_votes: movie.up_votes + 1 };
        }
        return movie;
      });
      setMoviesToWatch(updatedMovies);
      await axios.post(`https://${api_url}/film-festival/increase-up-votes/${filmId}/`);
    } catch (error) {
      console.error('Error increasing up-votes:', error);
    }
  };

  const markAsWatched = async (filmId) => {
    try {
      await axios.post(`https://${api_url}/film-festival/mark-as-watched/${filmId}/`);
      window.location.reload();
      const updatedMovies = moviesToWatch.map(movie => {
        if (movie.id === filmId) {
          return { ...movie, isWatched: true }; // Assuming you want to track watched status
        }
        return movie;
      });
      setMoviesToWatch(updatedMovies);
      setSnackbarMessage(`Has marcado como vista: ${moviesToWatch.find(movie => movie.id === filmId).tittle}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  };

  const confirmWatched = async () => {
    if (selectedFilmId) {
      await markAsWatched(selectedFilmId);
      setOpenDialog(false);
      setSelectedFilmId(null);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Films to Watch
      </Typography>
      <Grid container spacing={3}>
        {moviesToWatch.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card>
              <CardMedia
                component="img"
                image={movie.image}
                alt={`${movie.tittle} Poster`}
                sx={{ height: 450 }}
              />
              <CardContent>
                <Typography variant="h6">{movie.tittle}</Typography>
                <Typography variant="subtitle1">Up Votes: {movie.up_votes}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {movie.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => increaseUpVotes(movie.id)}
                >
                  Votar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedFilmId(movie.id);
                    setOpenDialog(true);
                  }}
                >
                  Vista
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirma la acción"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Seguro que quieres marcar esta pelicula como vista?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={() => confirmWatched()} color="primary" autoFocus>
            Si
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MoviesToWatch;
