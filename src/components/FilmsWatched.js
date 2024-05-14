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
  Rating
} from '@mui/material';

const api_url = process.env.REACT_APP_API_URL;

const FilmsWatched = () => {
  const [filmsWatched, setFilmsWatched] = useState([]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await axios.get(`https://${api_url}/film-festival/films-watched/`);
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
      await axios.post(`https://${api_url}/film-festival/create-rating/${filmId}/`, postData);
      const updatedFilms = filmsWatched.map(film => {
        if (film.id === filmId) {
          const newAverage = (film.average_rating * film.ratings.length + newValue) / (film.ratings.length + 1);
          return { ...film, average_rating: newAverage, ratings: [...film.ratings, { stars: newValue }] };
        }
        return film;
      });
      setFilmsWatched(updatedFilms);
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
                  size="large"
                //   precision={1}
                  max={10}
                  onChange={(event, newValue) => {
                    handleRating(newValue, film.id);
                  }}
                />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FilmsWatched;
