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
  Alert
} from '@mui/material';

const api_url = process.env.REACT_APP_API_URL;

const FilmsWatched = () => {
  const [filmsWatched, setFilmsWatched] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
    } catch (error) {
      console.error('Error posting rating:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Films Watched
      </Typography>
      <Grid container spacing={3}>
        {filmsWatched.map((film) => (
          <Grid item xs={12} sm={6} md={4} key={film.id}>
            <Card>
              <CardMedia
                component="img"
                image={film.image}
                alt={`${film.tittle} Poster`}
                sx={{ height: 450 }}
              />
              <CardContent>
                <Typography variant="h6">{film.tittle}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {film.description}
                </Typography>
                <Typography variant="subtitle1">
                  Watched on: {film.watched_date}
                </Typography>
                <Typography variant="subtitle1">
                  Average Rating: {film.average_rating.toFixed(2)}
                </Typography>
                <Typography variant="subtitle1">
                  Votes: {film.vote_count}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', padding: '16px' }}>
                <Rating
                  name="simple-controlled"
                  value={film.average_rating}
                  onChange={(event, newValue) => {
                    handleRating(newValue, film.id);
                  }}
                  max={10}
                />
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
    </Container>
  );
};

export default FilmsWatched;
