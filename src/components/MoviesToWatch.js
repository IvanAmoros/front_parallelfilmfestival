import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
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
	Box,
	Chip
} from '@mui/material';
import { useAuth } from '../AuthContext';

const api_url = process.env.REACT_APP_API_URL;

const MoviesToWatch = () => {
	const { isLoggedIn, user } = useAuth();
	const [moviesToWatch, setMoviesToWatch] = useState([]);
	const [userUpvotedFilms, setUserUpvotedFilms] = useState(new Set());
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedFilmId, setSelectedFilmId] = useState(null);
	const [expanded, setExpanded] = useState({});
	const [genres, setGenres] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);

	const fetchGenres = useCallback(async () => {
		try {
			const response = await api.get(`${api_url}/film-festival/genres/`);
			setGenres(response.data);
		} catch (error) {
			console.error('Error fetching genres:', error);
		}
	}, []);

	const fetchMovies = useCallback(async () => {
		let url = `${api_url}/film-festival/films-to-watch/`;
		if (selectedGenres.length > 0) {
			const genreParams = selectedGenres.map(genre => `genres=${genre}`).join('&');
			url += `?${genreParams}`;
		}
		try {
			const response = await api.get(url);
			setMoviesToWatch(response.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}, [selectedGenres]);

	const fetchUserUpvotedFilms = useCallback(async () => {
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
	}, [isLoggedIn]);

	useEffect(() => {
		fetchGenres();
	}, [fetchGenres]);

	useEffect(() => {
		fetchMovies();
	}, [selectedGenres, fetchMovies]);

	useEffect(() => {
		fetchUserUpvotedFilms();
	}, [fetchUserUpvotedFilms]);

	const increaseUpVotes = async (filmId) => {
		if (isLoggedIn) {
			try {
				const votedMovie = moviesToWatch.find(movie => movie.id === filmId);
				setSnackbarMessage(`Has votado a: ${votedMovie.tittle}`);
				setSnackbarSeverity('success');
				setSnackbarOpen(true);
				await api.post(`${api_url}/film-festival/increase-up-votes/${filmId}/`);
				await fetchMovies();  // Fetch the updated movies data
				await fetchUserUpvotedFilms();  // Fetch the updated upvoted films
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
						return { ...movie, isWatched: true };
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

	const formatGenres = (genres) => {
		if (!genres || genres.length === 0) return 'N/A';
		return genres.map(g => g.name).join(', ');
	};

	const handleGenreClick = (genre) => {
		setSelectedGenres(prevSelectedGenres => {
			if (prevSelectedGenres.includes(genre)) {
				return prevSelectedGenres.filter(g => g !== genre);
			} else {
				return [...prevSelectedGenres, genre];
			}
		});
	};

	return (
		<Container sx={{ px: 0.5, mb: 5 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Pendientes de ver
			</Typography>
			<Box sx={{ mb: 2 }}>
				{genres.map((genre) => (
					<Chip
						key={genre.id}
						label={genre.name}
						onClick={() => handleGenreClick(genre.name)}
						color={selectedGenres.includes(genre.name) ? 'primary' : 'default'}
						sx={{
							mr: 1,
							mb: 1,
							color: selectedGenres.includes(genre.name) ? 'white' : 'black',
							backgroundColor: selectedGenres.includes(genre.name) ? 'rgb(25, 118, 210)' : 'lightgray',
						}}
					/>
				))}
			</Box>
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
									<Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left' }}>
										Votos:
									</Typography>
									{movie.upvotes && (
										<Box sx={{ mb: 1 }}>
											{movie.upvotes.map((upvote) => (
												<Typography
													key={upvote.id}
													variant="body2"
													color="textSecondary"
													sx={{ textAlign: 'left' }}
												>
													{upvote.user}
												</Typography>
											))}
										</Box>
									)}
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
										sx={{ textAlign: 'left', mb: 1 }}
									>
										Genre: {formatGenres(movie.genres)}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{ textAlign: 'left', mb: 1 }}
									>
										Director: {movie.director}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{ textAlign: 'left', mb: 1 }}
									>
										Actors: {movie.actors}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{ textAlign: 'left', mb: 1 }}
									>
										Year: {movie.year}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{ textAlign: 'left', mb: 1 }}
									>
										Runtime: {movie.runtime}
									</Typography>
									<Typography
										variant="body2"
										color="textSecondary"
										sx={{ textAlign: 'left', mb: 1 }}
									>
										IMDb: {movie.imdb_rating}/10 ({formatVotes(movie.imdb_votes)} votos)
									</Typography>
									{movie.providers && movie.providers.length > 0 && (
										<Box>
											<Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left', mb: 1 }}>
												Available on:
											</Typography>
											<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.2 }}>
												{movie.providers.map(provider => (
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
