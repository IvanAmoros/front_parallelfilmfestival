import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Rating,
  Snackbar,
  Alert,
  CardActionArea,
  Collapse,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@mui/material';

const api_url = process.env.REACT_APP_API_URL;

const FilmsWatched = () => {
  const [filmsWatched, setFilmsWatched] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expanded, setExpanded] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await axios.get(`${api_url}/film-festival/films-watched/`);
        setFilmsWatched(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchFilms();
  }, []);

  const handleRating = async (newValue, filmId) => {
    try {
      const postData = { stars: newValue };
      await axios.post(`${api_url}/film-festival/create-rating/${filmId}/`, postData);
      const updatedFilms = filmsWatched.map(film => {
        if (film.id === filmId) {
          const newVoteCount = film.ratings.length + 1;
          const newRatings = [...film.ratings, { stars: newValue }];
          const newAverage = newRatings.reduce((acc, curr) => acc + curr.stars, 0) / newRatings.length;
          return { ...film, average_rating: newAverage, ratings: newRatings, vote_count: newVoteCount };
        }
        return film;
      });
      setFilmsWatched(updatedFilms);
      setSnackbarMessage(`Has votado con un ${newValue}`);
      setSnackbarOpen(true);
      setOpenModal(false);
    } catch (error) {
      console.error('Error posting rating:', error);
    }
  };

  const handleExpandClick = (movieId) => {
    setExpanded(prevState => ({ ...prevState, [movieId]: !prevState[movieId] }));
  };

  const openRatingModal = (film) => {
    setSelectedFilm(film);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedFilm(null);
    setRating(0);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Ya vistas
      </Typography>
      <Grid container spacing={1}>
        {filmsWatched.map((film) => (
          <Grid item xs={6} sm={4} md={3} key={film.id}>
            <Card>
              <CardActionArea onClick={() => handleExpandClick(film.id)}>
                <CardMedia
                  component="img"
                  image={film.image}
                  alt={`${film.tittle} Poster`}
                  sx={{ height: 300 }}
                />
                <CardContent>
                  <Typography variant="h6">{film.tittle}</Typography>
                  <Typography variant="subtitle1">
                    Vista: {film.watched_date}
                  </Typography>
                  <Typography variant="subtitle1">
                    Rating: {film.average_rating.toFixed(2)} ({film.vote_count})
                  </Typography>
                  <Rating
                    name="read-only"
                    value={film.average_rating / 2}
                    readOnly
                    precision={0.1}
                    max={5}
                  />
                </CardContent>
              </CardActionArea>
              <Collapse in={expanded[film.id]} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {film.description}
                  </Typography>
                </CardContent>
              </Collapse>
              <CardActions sx={{ justifyContent: 'center', padding: '16px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openRatingModal(film)}
                >
                  Valorar
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
      <Dialog open={openModal} onClose={closeModal}>
        <DialogTitle>Valorar película</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedFilm && selectedFilm.tittle}
          </DialogContentText>
          <Rating
            name="rating-controlled"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            max={10}
            precision={1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleRating(rating, selectedFilm.id)}
            color="primary"
          >
            Valorar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FilmsWatched;
