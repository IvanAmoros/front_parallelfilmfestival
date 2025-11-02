import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SkeletonLoading from './SkeletonLoading'
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
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Box,
    Fade,
    Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../AuthContext';

const api_url = process.env.REACT_APP_API_URL;

const FilmsWatched = () => {
    const { isLoggedIn, accessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [filmsWatched, setFilmsWatched] = useState([]);
    const [userRatedFilms, setUserRatedFilms] = useState(new Set());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedFilmDetails, setSelectedFilmDetails] = useState(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedFilmForRating, setSelectedFilmForRating] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchFilms = async () => {
            setLoading(true);
            try {
                const response = await api.get(`${api_url}/film-festival/films-watched/`);
                setFilmsWatched(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        const fetchUserRatedFilms = async () => {
            if (isLoggedIn) {
                try {
                    const response = await api.get(`${api_url}/film-festival/user-rated-films/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    const ratedFilmIds = new Set(response.data.map(film => film.id));
                    setUserRatedFilms(ratedFilmIds);
                } catch (error) {
                    console.error('Error fetching user rated films:', error);
                }
            }
        };

        fetchFilms();
        fetchUserRatedFilms();
    }, [isLoggedIn, accessToken]);

    const handleRating = async (newValue, filmId) => {
        try {
            const postData = { stars: newValue };
            await api.post(`${api_url}/film-festival/create-rating/${filmId}/`, postData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const updatedFilms = filmsWatched.map(film => {
                if (film.id === filmId) {
                    const newVoteCount = film.ratings.length + 1;
                    const newRatings = [...film.ratings, { stars: newValue, user: 'current_user' }];
                    const newAverage = newRatings.reduce((acc, curr) => acc + curr.stars, 0) / newRatings.length;
                    return { ...film, average_rating: newAverage, ratings: newRatings, vote_count: newVoteCount };
                }
                return film;
            });
            setFilmsWatched(updatedFilms);
            setUserRatedFilms(new Set(userRatedFilms).add(filmId));
            setRating(0);
            setSnackbarMessage(`Has votado con un ${newValue}`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setRatingModalOpen(false);
            setSelectedFilmForRating(null);
        } catch (error) {
            console.error('Error posting rating:', error);
            setSnackbarMessage('Error al enviar la valoración');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const openFilmDetailModal = (film) => {
        setSelectedFilmDetails(film);
        setDetailModalOpen(true);
    };

    const closeFilmDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedFilmDetails(null);
    };

    const openRatingModal = (film) => {
        if (isLoggedIn) {
            setSelectedFilmForRating(film);
            setRatingModalOpen(true);
        } else {
            setSnackbarMessage('Debe iniciar sesión primero para valorar una película');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
        }
    };

    const closeRatingModal = () => {
        setRatingModalOpen(false);
        setSelectedFilmForRating(null);
        setRating(0);
    };

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

    const formatGenres = (genres) => {
        if (!genres || genres.length === 0) return 'N/A';
        return genres.map(g => g.name).join(', ');
    };

    return (
        <Container sx={{ px: 0.5, mb: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Ya vistas
            </Typography>
            {loading ? (
                <SkeletonLoading />
            ) : (
                <Fade in={true} timeout={1000}>
                    <Grid container spacing={0.5}>
                        {filmsWatched.map((film) => (
                            <Grid size={{ xs: 4, sm: 4, md: 3 }} key={film.id}>
                                <Card>
                                    <CardActionArea sx={{ backgroundColor: '#e7f0fe' }} onClick={() => openFilmDetailModal(film)}>
                                        <Box sx={{ position: 'relative', paddingTop: '150%' }}>
                                            <CardMedia
                                                component="img"
                                                image={film.image}
                                                alt={`${film.tittle} Poster`}
                                                loading="lazy"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </Box>
                                        <CardContent
                                            sx={{
                                                padding: 0,
                                                paddingTop: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                                <Chip
                                                    sx={{ borderRadius: 2, color: 'white', fontSize: 20, fontWeight: 'bold', maxWidth: 100, backgroundColor: '#4682B4' }}
                                                    label={film.average_rating.toFixed(2)}
                                                />
                                                <Typography variant="subtitle1">
                                                    <PersonIcon sx={{ fontSize: 'medium' }} /> {film.vote_count}
                                                </Typography>
                                            </Box>
                                            <Rating
                                                name="read-only"
                                                value={film.average_rating / 2}
                                                readOnly
                                                precision={0.1}
                                                max={5}
                                            />
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions sx={{ justifyContent: 'center', padding: 1, backgroundColor: '#e7f0fe' }}>
                                        <Button
                                            sx={{ backgroundColor: userRatedFilms.has(film.id) ? 'secondary' : '#5CB6FF', borderRadius: 4 }}
                                            fullWidth
                                            variant="contained"
                                            onClick={() => openRatingModal(film)}
                                            disabled={userRatedFilms.has(film.id)}
                                        >
                                            {userRatedFilms.has(film.id) ? 'valorada' : 'Valorar'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Fade>
            )}
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
            <Dialog
                open={detailModalOpen}
                onClose={closeFilmDetailModal}
                maxWidth="md"
                fullWidth
            >
                {selectedFilmDetails && (
                    <>
                        <DialogTitle>{selectedFilmDetails.tittle}</DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                <Box sx={{ flexShrink: 0 }}>
                                    <Box
                                        component="img"
                                        src={selectedFilmDetails.image}
                                        alt={`${selectedFilmDetails.tittle} Poster`}
                                        sx={{ width: { xs: '100%', sm: 240 }, borderRadius: 2, display: 'block' }}
                                    />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Chip
                                            sx={{ borderRadius: 2, color: 'white', fontSize: 20, fontWeight: 'bold', maxWidth: 100, backgroundColor: '#4682B4' }}
                                            label={selectedFilmDetails.average_rating.toFixed(2)}
                                        />
                                        <Typography variant="subtitle1">
                                            <PersonIcon sx={{ fontSize: 'medium' }} /> {selectedFilmDetails.vote_count}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                        Vista: {selectedFilmDetails.watched_date}
                                    </Typography>
                                    {selectedFilmDetails.ratings && selectedFilmDetails.ratings.length > 0 && (
                                        <Box sx={{ mb: 1 }}>
                                            {selectedFilmDetails.ratings.map((rating) => (
                                                <Typography
                                                    key={rating.id}
                                                    variant="body2"
                                                    color="textSecondary"
                                                    sx={{ textAlign: 'left' }}
                                                >
                                                    {rating.user}: {rating.stars}/10
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'justify', mb: 1 }}
                                    >
                                        {selectedFilmDetails.description}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left', mb: 1 }}
                                    >
                                        Genre: {formatGenres(selectedFilmDetails.genres)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left', mb: 1 }}
                                    >
                                        Director: {selectedFilmDetails.director}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left', mb: 1 }}
                                    >
                                        Actors: {selectedFilmDetails.actors}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left', mb: 1 }}
                                    >
                                        Year: {selectedFilmDetails.year}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left', mb: 1 }}
                                    >
                                        Runtime: {selectedFilmDetails.runtime}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left', mb: 1 }}
                                    >
                                        IMDb: {selectedFilmDetails.imdb_rating}/10 ({formatVotes(selectedFilmDetails.imdb_votes)} votos)
                                    </Typography>
                                    {selectedFilmDetails.providers && selectedFilmDetails.providers.length > 0 && (
                                        <Box>
                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', mb: 1 }}>
                                                Available on:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.2 }}>
                                                {selectedFilmDetails.providers.map(provider => (
                                                    <img
                                                        key={provider.id}
                                                        src={provider.image_url}
                                                        alt={provider.name}
                                                        style={{ width: 48, height: 48, borderRadius: 10 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeFilmDetailModal}>Cerrar</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            <Dialog open={ratingModalOpen} onClose={closeRatingModal}>
                <DialogTitle>Valorar película</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedFilmForRating && selectedFilmForRating.tittle}
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
                    <Button onClick={closeRatingModal} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => selectedFilmForRating && handleRating(rating, selectedFilmForRating.id)}
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
