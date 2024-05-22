import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api'; // Import the custom Axios instance
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
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../AuthContext';

const omdbApiKey = process.env.REACT_APP_OMDB_KEY;
const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;
const api_url = process.env.REACT_APP_API_URL;

const MovieSearch = () => {
    const { isLoggedIn, accessToken } = useAuth();
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const searchBoxRef = useRef(null);
    const inputRef = useRef(null);

    const searchMovie = async () => {
        const options = {
            method: 'GET',
            url: 'https://www.omdbapi.com/',
            params: {
                apikey: omdbApiKey,
                s: query,
                type: 'movie',
            }
        };

        try {
            const response = await api.request(options);
            if (response.data.Response === 'True') {
                const initialMovies = response.data.Search;
                const detailedMoviesPromises = initialMovies.map(movie =>
                    getMovieDetails(movie.imdbID)
                );
                const detailedMovies = await Promise.all(detailedMoviesPromises);

                const mergedMovies = initialMovies.map((movie, index) => {
                    return { ...movie, details: detailedMovies[index] };
                });

                setMovies(mergedMovies);
            } else {
                setMovies([]);
                setSnackbarMessage(`No se ha obtenido ningún resultado con "${query}"`);
                setSnackbarSeverity('warning');
                setSnackbarOpen(true);
            }
            inputRef.current.blur();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getMovieDetails = async (imdbID) => {
        const options = {
            method: 'GET',
            url: 'https://www.omdbapi.com/',
            params: {
                apikey: omdbApiKey,
                i: imdbID,
                plot: 'short',
                r: 'json'
            }
        };

        try {
            const response = await api.request(options);
            const movieDetails = response.data;
            const providers = await getStreamingProviders(imdbID);
            return { ...movieDetails, providers };
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

    const getStreamingProviders = async (imdbID) => {
        const tmdbOptions = {
            method: 'GET',
            url: `https://api.themoviedb.org/3/movie/${imdbID}/watch/providers`,
            params: {
                api_key: tmdbApiKey,
            }
        };

        try {
            const response = await api.request(tmdbOptions);
            return response.data.results?.ES?.flatrate || [];
        } catch (error) {
            return [];
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchMovie();
        }
    };

    const markAsProposal = async (movie) => {
        if (!isLoggedIn) {
            setSnackbarMessage('Debe iniciar sesión primero para proponer una película.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        const providers = movie.details.providers.map(provider => ({
            name: provider.provider_name,
            image_url: `https://image.tmdb.org/t/p/original${provider.logo_path}`
        }));

        const postData = {
            tittle: movie.Title,
            image: movie.Poster,
            description: movie.details ? movie.details.Plot : null,
            year: movie.details ? movie.details.Year : null,
            runtime: movie.details ? movie.details.Runtime : null,
            genre: movie.details ? movie.details.Genre : null,
            director: movie.details ? movie.details.Director : null,
            actors: movie.details ? movie.details.Actors : null,
            imdb_rating: movie.details ? movie.details.imdbRating : null,
            imdb_votes: movie.details ? movie.details.imdbVotes : null,
            imdb_id: movie.details ? movie.details.imdbID : null,
            providers: providers
        };

        try {
            await api.post(`${api_url}/film-festival/films-to-watch/`, postData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setSnackbarMessage('Propuesta enviada con éxito.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            window.location.reload();
        } catch (error) {
            console.error('Error posting data:', error);
            setSnackbarMessage('Error: La película ya ha sido propuesta.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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

    const formatVotes = (votes) => {
        if (!votes) return 'N/A';
        const numericVotes = parseInt(votes.replace(/,/g, ''), 10);
        if (numericVotes >= 1000000) {
            return (numericVotes / 1000000).toFixed(1).replace('.', ',') + ' M';
        } else if (numericVotes >= 1000) {
            return (numericVotes / 1000).toFixed(1).replace('.', ',') + ' mil';
        }
        return numericVotes.toString();
    };

    return (
        <Container sx={{ px: 0.5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Busca tu propuesta
            </Typography>
            <Box ref={searchBoxRef} sx={{ backgroundColor: 'white', padding: 2, borderRadius: 1, mb: 3 }}>
                <TextField
                    inputRef={inputRef}
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
            <Grid container spacing={0.5} mb={2}>
                {movies.map((movie) => (
                    <Grid item xs={6} sm={4} md={3} key={movie.imdbID}>
                        <Card>
                            <CardActionArea onClick={() => handleExpandClick(movie.imdbID)}>
                                <Box sx={{ position: 'relative', paddingTop: '150%' }}>
                                    {movie.Poster !== 'N/A' && (
                                        <CardMedia
                                            component="img"
                                            image={movie.Poster}
                                            alt={`${movie.Title} Poster`}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                </Box>
                                <CardContent sx={{ padding: 0, paddingTop: 1 }}>
                                    <Typography variant="h6">{movie.Title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Año: {movie.Year}
                                    </Typography>
                                    {movie.details && movie.details.imdbRating && (
                                        <Typography variant="body2" color="textSecondary">
                                            {movie.details.imdbRating}/10 ({formatVotes(movie.details.imdbVotes)} votos)
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                            {movie.details && (
                                <Collapse in={expanded[movie.imdbID]} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'justify', mb: 1 }}>
                                            {movie.details.Plot}
                                        </Typography>
                                        {movie.details.Genre && (
                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
                                                Genre: {movie.details.Genre}
                                            </Typography>
                                        )}
                                        {movie.details.Director && (
                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
                                                Director: {movie.details.Director}
                                            </Typography>
                                        )}
                                        {movie.details.Actors && (
                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
                                                Actors: {movie.details.Actors}
                                            </Typography>
                                        )}
                                        {movie.details.Runtime && (
                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
                                                Runtime: {movie.details.Runtime}
                                            </Typography>
                                        )}
                                        {movie.details.providers && movie.details.providers.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', mb: 1 }}>
                                                    Available on:
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.2 }}>
                                                    {movie.details.providers.map(provider => (
                                                        <img
                                                            key={provider.provider_id}
                                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                            alt={provider.provider_name}
                                                            style={{ width: 45, height: 45, borderRadius: 10 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Collapse>
                            )}
                            <CardActions>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => markAsProposal(movie)}
                                >
                                    PROPONER
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
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MovieSearch;
