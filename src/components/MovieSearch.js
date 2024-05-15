import React, { useState, useEffect, useRef } from 'react';
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
    CardActionArea,
    Collapse,
    Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const token = process.env.REACT_APP_TMDB_TOKEN;
const key = process.env.REACT_APP_TMDB_KEY;
const api_url = process.env.REACT_APP_API_URL;

const MovieSearch = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [expanded, setExpanded] = useState({});
    const searchBoxRef = useRef(null);

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

    const markAsProposal = async (movie) => {
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

    const handleExpandClick = (movieId) => {
        setExpanded(prevState => ({ ...prevState, [movieId]: !prevState[movieId] }));
    };

    useEffect(() => {
        if (movies.length > 0) {
            searchBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [movies]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Busca tu propuesta
            </Typography>
            <Box ref={searchBoxRef} sx={{ backgroundColor: 'white', padding: 2, borderRadius: 1, mb: 3 }}>
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
                />
            </Box>
            {movies.length > 0 && (
                <Typography variant="h5" component="h2" mb={3}>
                    Resultados de búsqueda
                </Typography>
            )}
            <Grid container spacing={1} mb={2}>
                {movies.map((movie) => (
                    <Grid item xs={6} sm={4} md={3} key={movie.id}>
                        <Card>
                            <CardActionArea onClick={() => handleExpandClick(movie.id)}>
                                {movie.poster_path && (
                                    <CardMedia
                                        component="img"
                                        image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={`${movie.title} Poster`}
                                        sx={{ height: 300 }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{movie.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Rating: {movie.vote_average}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        ({movie.vote_count} votes)
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Release Date: {movie.release_date}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <Collapse in={expanded[movie.id]} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        {movie.overview}
                                    </Typography>
                                </CardContent>
                            </Collapse>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => markAsProposal(movie)}
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
