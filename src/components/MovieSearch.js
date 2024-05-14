import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const token = process.env.REACT_APP_TMDB_TOKEN;
const key = process.env.REACT_APP_TMDB_KEY;
const api_url = process.env.REACT_APP_API_URL;

const MovieSearch = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);

    const searchMovie = async () => {
        const options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie',
            params: {
                api_key: key,
                query: query,
                include_adult: 'false',
                language: 'en-US',
                page: '1',
            },
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.request(options);
            const sortedMovies = response.data.results.sort((a, b) => b.popularity - a.popularity);
            setMovies(sortedMovies || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchMovie();
        }
    };

    const markAsproposal = async (movie) => {
        const postData = {
            tittle: movie.original_title || movie.title,
            image: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
            description: movie.overview,
        };

        try {
            await axios.post(`${api_url}/film-festival/films-to-watch/`, postData);
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Busca tu propuesta
            </Typography>
            <TextField
                label="Enter movie title"
                variant="outlined"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={searchMovie}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ marginBottom: 3 }}
            />
            <Typography variant="h5" component="h2">
                Search Results
            </Typography>
            <Grid container spacing={3}>
                {movies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} key={movie.id}>
                        <Card>
                            {movie.poster_path && (
                                <CardMedia
                                    component="img"
                                    image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                    alt={`${movie.title} Poster`}
                                    sx={{ height: 450 }}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{movie.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {movie.overview}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Rating: {movie.vote_average} ({movie.vote_count} votes)
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Release Date: {movie.release_date}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => markAsproposal(movie)}
                                >
                                    Marcar como propuesta
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default MovieSearch;
