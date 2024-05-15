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
	DialogTitle,
	CardActionArea,
	Collapse,
	Box
} from '@mui/material';

const api_url = process.env.REACT_APP_API_URL;

const MoviesToWatch = () => {
	const [moviesToWatch, setMoviesToWatch] = useState([]);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedFilmId, setSelectedFilmId] = useState(null);
	const [expanded, setExpanded] = useState({});

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const response = await axios.get(`${api_url}/film-festival/films-to-watch/`);
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
			await axios.post(`${api_url}/film-festival/increase-up-votes/${filmId}/`);
		} catch (error) {
			console.error('Error increasing up-votes:', error);
		}
	};

	const markAsWatched = async (filmId) => {
		try {
			await axios.post(`${api_url}/film-festival/mark-as-watched/${filmId}/`);
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
		<Container sx={{ px: 0.5 }}>
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
									<Typography variant="subtitle1">Up Votes: {movie.up_votes}</Typography>
								</CardContent>
							</CardActionArea>
							<Collapse in={expanded[movie.id]} timeout="auto" unmountOnExit>
								<CardContent>
									<Typography variant="body2" color="textSecondary">
										{movie.description}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Genre: {movie.genre}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Director: {movie.director}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Actors: {movie.actors}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Year: {movie.year}
									</Typography>
									<Typography variant="body2" color="textSecondary">
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
											color="primary"
											fullWidth
											onClick={() => increaseUpVotes(movie.id)}
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
												setSelectedFilmId(movie.id);
												setOpenDialog(true);
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
