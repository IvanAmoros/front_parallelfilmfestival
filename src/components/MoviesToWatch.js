import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Import the custom Axios instance
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
	DialogTitle,
	CardActionArea,
	Collapse,
	Box
} from '@mui/material';
import { useAuth } from '../AuthContext'; // Import useAuth to check authentication status

const api_url = process.env.REACT_APP_API_URL;

const MoviesToWatch = () => {
	const { isLoggedIn, user } = useAuth(); // Destructure isLoggedIn and user from useAuth
	const [moviesToWatch, setMoviesToWatch] = useState([]);
	const [userUpvotedFilms, setUserUpvotedFilms] = useState(new Set()); // Use a set to store IDs of upvoted films
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // State to control the severity of the Snackbar
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedFilmId, setSelectedFilmId] = useState(null);
	const [expanded, setExpanded] = useState({});

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await api.get(`${api_url}/film-festival/films-to-watch/`);
				setMoviesToWatch(response.data);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		const fetchUserUpvotedFilms = async () => {
			if (isLoggedIn) {
				try {
					const response = await api.get(`${api_url}/film-festival/user-upvoted-films/`, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
						}
					});
					const upvotedFilmIds = new Set(response.data.map(film => film.id));
					setUserUpvotedFilms(upvotedFilmIds);
				} catch (error) {
					console.error('Error fetching user upvoted films:', error);
				}
			}
		};

		fetchMovies();
		fetchUserUpvotedFilms();
	}, [isLoggedIn]);

	const increaseUpVotes = async (filmId) => {
		if (isLoggedIn) {
			try {
				const votedMovie = moviesToWatch.find(movie => movie.id === filmId);
				setSnackbarMessage(`Has votado a: ${votedMovie.tittle}`);
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
				const updatedMovies = moviesToWatch.map(movie => {
					if (movie.id === filmId) {
						return { ...movie, total_upvotes: movie.total_upvotes + 1 };
					}
					return movie;
				});
				setMoviesToWatch(updatedMovies);
				setUserUpvotedFilms(new Set(userUpvotedFilms).add(filmId)); // Add the film ID to the upvoted films set
				await api.post(`${api_url}/film-festival/increase-up-votes/${filmId}/`);
			} catch (error) {
				setSnackbarMessage('Ha sucedido un error al hacer la petición');
				setSnackbarSeverity('warning');
				setSnackbarOpen(true);
				console.error('Error increasing up-votes:', error);
			}
		} else {
			setSnackbarMessage('Debe iniciar sesión primero para votar.');
			setSnackbarSeverity('warning');
			setSnackbarOpen(true);
		}
	};

	const markAsWatched = async (filmId) => {
		if (isLoggedIn && user && user.is_superuser) {
			try {
				await api.post(`${api_url}/film-festival/mark-as-watched/${filmId}/`);
				window.location.reload();
				const updatedMovies = moviesToWatch.map(movie => {
					if (movie.id === filmId) {
						return { ...movie, isWatched: true }; // Assuming you want to track watched status
					}
					return movie;
				});
				setMoviesToWatch(updatedMovies);
				setSnackbarMessage(`Has marcado como vista: ${moviesToWatch.find(movie => movie.id === filmId).tittle}`);
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
			} catch (error) {
				console.error('Error marking as watched:', error);
			}
		} else {
			setSnackbarMessage(isLoggedIn ? 'Debe ser superusuario para marcar como vista.' : 'Debe iniciar sesión primero.');
			setSnackbarSeverity('warning');
			setSnackbarOpen(true);
		}
	};

	const confirmWatched = async () => {
		if (selectedFilmId) {
			await markAsWatched(selectedFilmId);
			setOpenDialog(false);
			setSelectedFilmId(null);
		}
	};

	const handleExpandClick = (movieId) => {
		setExpanded(prevState => ({ ...prevState, [movieId]: !prevState[movieId] }));
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

	return (
		<Container sx={{ px: 0.5, mb: 5 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Pendientes de ver
			</Typography>
			<Grid container spacing={0.5} padding={0}>
				{moviesToWatch.map((movie) => (
					<Grid item xs={6} sm={4} md={3} key={movie.id}>
						<Card>
							<CardActionArea onClick={() => handleExpandClick(movie.id)}>
								<Box sx={{ position: 'relative', paddingTop: '150%' }}>
									<CardMedia
										component="img"
										image={movie.image}
										alt={`${movie.tittle} Poster`}
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
								<CardContent sx={{ padding: 0, paddingTop: 1 }}>
									<Typography variant="h6">{movie.tittle}</Typography>
									<Typography variant="subtitle1">Up Votes: {movie.total_upvotes}</Typography>
								</CardContent>
							</CardActionArea>
							<Collapse in={expanded[movie.id]} timeout="auto" unmountOnExit>
								<CardContent>
								<Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'justify', mb: 1 }}
                                    >
                                        {movie.description}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left' }}
                                    >
                                        Genre: {movie.genre}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left' }}
                                    >
                                        Director: {movie.director}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left' }}
                                    >
                                        Actors: {movie.actors}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left' }}
                                    >
                                        Year: {movie.year}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ textAlign: 'left' }}
                                    >
                                        Runtime: {movie.runtime}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {movie.imdb_rating}/10 ({formatVotes(movie.imdb_votes)} votos)
                                    </Typography>
								</CardContent>
							</Collapse>
							<CardActions>
								<Grid container spacing={1}>
									<Grid item xs={6}>
										<Button
											variant="contained"
											color={userUpvotedFilms.has(movie.id) ? 'secondary' : 'primary'}
											fullWidth
											onClick={() => increaseUpVotes(movie.id)}
											disabled={userUpvotedFilms.has(movie.id)}
										>
											Votar
										</Button>
									</Grid>
									<Grid item xs={6}>
										<Button
											variant="contained"
											color="primary"
											fullWidth
											onClick={() => {
												if (isLoggedIn && user && user.is_superuser) {
													setSelectedFilmId(movie.id);
													setOpenDialog(true);
												} else {
													setSnackbarMessage(isLoggedIn ? 'Debe ser superusuario para marcar como vista.' : 'Debe iniciar sesión primero.');
													setSnackbarSeverity('warning');
													setSnackbarOpen(true);
												}
											}}
										>
											Vista
										</Button>
									</Grid>
								</Grid>
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
