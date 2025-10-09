import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Switch,
    FormControlLabel,
    FormHelperText,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Typography,
    Divider,
    CircularProgress,
    Grid,
    CardMedia,
    Box,
    CardActionArea,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";
import MovieSearchModal from "./MovieSearchModal";
import api from "../utils/api";

const api_url = process.env.REACT_APP_API_URL;

const Events = () => {
    const { isLoggedIn, accessToken, user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        fecha: "",
        horaConvocatoria: "",
        horaInicio: "",
        allowProposals: true,
    });
    const [error, setError] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [openMovieModal, setOpenMovieModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get(`${api_url}/film-festival/events/`);
            setEvents(response.data);
        } catch (err) {
            console.error("Error al cargar eventos:", err);
            setSnackbarMessage("Error al cargar eventos.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            titulo: "",
            descripcion: "",
            fecha: "",
            horaConvocatoria: "",
            horaInicio: "",
            allowProposals: true,
        });
        setError("");
        setEditingEventId(null);
        setIsEditing(false);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !form.titulo ||
            !form.descripcion ||
            !form.fecha ||
            !form.horaConvocatoria ||
            !form.horaInicio
        ) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        const dateObj = new Date(form.fecha);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}/${String(
            dateObj.getMonth() + 1
        ).padStart(2, "0")}/${dateObj.getFullYear()}`;
        const postData = {
            title: form.titulo,
            description: form.descripcion,
            date: formattedDate,
            meeting_hour: form.horaConvocatoria,
            start_hour: form.horaInicio,
            allow_proposals: form.allowProposals,
        };

        try {
            if (isEditing) {
                await api.put(`${api_url}/film-festival/events/${editingEventId}/`, postData, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setSnackbarMessage("Evento actualizado correctamente.");
            } else {
                await api.post(`${api_url}/film-festival/events/`, postData, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setSnackbarMessage("Evento creado con éxito.");
            }

            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (err) {
            console.error(err);
            setSnackbarMessage("Error al guardar el evento.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSwitchChange = () =>
        setForm((prev) => ({ ...prev, allowProposals: !prev.allowProposals }));

    const handleOpenMovieModal = (eventId) => {
        if (!isLoggedIn) {
            setSnackbarMessage("Debes iniciar sesión para proponer una película.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        const selectedEvent = events.find((e) => e.id === eventId);
        const alreadyProposed = selectedEvent?.proposed_films?.some(
            (pf) => pf.proposed_by === user.username
        );
        if (alreadyProposed) {
            setSnackbarMessage("Ya has propuesto una película en este evento.");
            setSnackbarSeverity("info");
            setSnackbarOpen(true);
            return;
        }
        if (
            !selectedEvent.allow_proposals &&
            selectedEvent.created_by !== user.username
        ) {
            setSnackbarMessage("Este evento no permite propuestas.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        setSelectedEventId(eventId);
        setOpenMovieModal(true);
    };

    const handleCloseMovieModal = () => {
        setSelectedEventId(null);
        setOpenMovieModal(false);
        fetchEvents();
    };

    const addProposalToEvent = (eventId, newProposal) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === eventId
                    ? {
                        ...event,
                        proposed_films: [...(event.proposed_films || []), newProposal],
                    }
                    : event
            )
        );
    };

    const formatGenres = (genres) => {
        if (!genres || genres.length === 0) return "N/A";
        return genres.map((g) => g.name).join(", ");
    };

    const handleUpvote = async (proposalId, hasVoted) => {
        if (!isLoggedIn) {
            setSnackbarMessage("Debes iniciar sesión para votar.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        try {
            if (hasVoted) {
                await api.delete(`${api_url}/film-festival/events/upvote/${proposalId}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setSnackbarMessage("Voto eliminado.");
            } else {
                await api.post(
                    `${api_url}/film-festival/events/upvote/${proposalId}/`,
                    {},
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setSnackbarMessage("Voto añadido.");
            }
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            setEvents((prevEvents) =>
                prevEvents.map((event) => ({
                    ...event,
                    proposed_films: event.proposed_films.map((pf) =>
                        pf.id === proposalId
                            ? {
                                ...pf,
                                upvotes: hasVoted
                                    ? pf.upvotes.filter((u) => u.user !== user.username)
                                    : [...pf.upvotes, { id: Date.now(), user: user.username }],
                                upvote_count: hasVoted
                                    ? pf.upvote_count - 1
                                    : pf.upvote_count + 1,
                            }
                            : pf
                    ),
                }))
            );
        } catch (err) {
            console.error("Error al votar:", err);
            setSnackbarMessage("Error al procesar el voto.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleEditEvent = (event) => {
        setIsEditing(true);
        setEditingEventId(event.id);
        setForm({
            titulo: event.title,
            descripcion: event.description,
            fecha: event.date.split("/").reverse().join("-"),
            horaConvocatoria: event.meeting_hour,
            horaInicio: event.start_hour,
            allowProposals: event.allow_proposals,
        });
        setShowModal(true);
    };

    const handleDeleteEvent = async () => {
        if (!editingEventId) return;
        try {
            await api.delete(`${api_url}/film-festival/events/${editingEventId}/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setSnackbarMessage("Evento eliminado correctamente.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (err) {
            console.error(err);
            setSnackbarMessage("Error al eliminar el evento.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <div>
            <Typography variant="h4" component="h1" gutterBottom>
                Eventos
            </Typography>

            {isLoggedIn && user.is_superuser && (
                <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
                    Crear nuevo evento
                </Button>
            )}

            <Stack spacing={2} sx={{ mt: 3 }}>
                {loading ? (
                    <CircularProgress sx={{ alignSelf: "center" }} />
                ) : events.length === 0 ? (
                    <Typography color="text.secondary" align="center">
                        No hay eventos todavía.
                    </Typography>
                ) : (
                    events.map((event) => (
                        <Card key={event.id} variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{event.title}</Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {event.description}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2">
                                    📅 {event.date} — 🕒 Convocatoria: {event.meeting_hour.slice(0, 5)} / Inicio:{" "}
                                    {event.start_hour.slice(0, 5)}
                                </Typography>

                                {event.proposed_films && event.proposed_films.length > 0 && (
                                    <Grid container spacing={1} sx={{ mt: 1 }}>
                                        {event.proposed_films.map((proposal) => {
                                            const film = proposal.film;
                                            const hasVoted = proposal.upvotes.some(
                                                (u) => u.user === user?.username
                                            );

                                            return (
                                                <Grid item xs={6} sm={4} md={3} key={proposal.id}>
                                                    <Card sx={{ backgroundColor: "#f5f8ff" }}>
                                                        <CardActionArea>
                                                            <Box sx={{ position: "relative", paddingTop: "150%" }}>
                                                                <CardMedia
                                                                    component="img"
                                                                    image={film.image}
                                                                    alt={film.tittle}
                                                                    loading="lazy"
                                                                    sx={{
                                                                        position: "absolute",
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                            </Box>
                                                        </CardActionArea>
                                                        <CardContent sx={{ p: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                {film.year} — IMDb {film.imdb_rating}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                {formatGenres(film.genres)}
                                                            </Typography>
                                                            <Typography variant="caption" display="block">
                                                                Propuesta por: {proposal.proposed_by}
                                                            </Typography>

                                                            <Box sx={{ mt: 1 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    <ThumbUpIcon
                                                                        sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.3 }}
                                                                    />
                                                                    {proposal.upvote_count} {proposal.upvote_count === 1 ? "voto" : "votos"}
                                                                </Typography>
                                                                <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                                    {proposal.upvotes.map((u) => (
                                                                        <Typography
                                                                            key={u.id}
                                                                            variant="caption"
                                                                            sx={{
                                                                                backgroundColor: "#e0e7ff",
                                                                                borderRadius: "8px",
                                                                                px: 0.7,
                                                                                py: 0.2,
                                                                            }}
                                                                        >
                                                                            {u.user}
                                                                        </Typography>
                                                                    ))}
                                                                </Box>
                                                            </Box>

                                                            {proposal.proposed_by === user?.username ? (
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="small"
                                                                    sx={{ mt: 1, borderRadius: 2 }}
                                                                    onClick={async () => {
                                                                        try {
                                                                            await api.delete(
                                                                                `${api_url}/film-festival/events/delete-proposed-film/${proposal.id}/`,
                                                                                {
                                                                                    headers: { Authorization: `Bearer ${accessToken}` },
                                                                                }
                                                                            );
                                                                            setSnackbarMessage("Propuesta eliminada correctamente.");
                                                                            setSnackbarSeverity("success");
                                                                            setSnackbarOpen(true);

                                                                            setEvents((prevEvents) =>
                                                                                prevEvents.map((ev) =>
                                                                                    ev.id === event.id
                                                                                        ? {
                                                                                            ...ev,
                                                                                            proposed_films: ev.proposed_films.filter(
                                                                                                (pf) => pf.id !== proposal.id
                                                                                            ),
                                                                                        }
                                                                                        : ev
                                                                                )
                                                                            );
                                                                        } catch (err) {
                                                                            console.error("Error al borrar la propuesta:", err);
                                                                            setSnackbarMessage("Error al borrar la propuesta.");
                                                                            setSnackbarSeverity("error");
                                                                            setSnackbarOpen(true);
                                                                        }
                                                                    }}
                                                                >
                                                                    Borrar propuesta 🗑️
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant={hasVoted ? "outlined" : "contained"}
                                                                    size="small"
                                                                    color={hasVoted ? "secondary" : "primary"}
                                                                    sx={{ mt: 1, borderRadius: 2 }}
                                                                    onClick={() => handleUpvote(proposal.id, hasVoted)}
                                                                >
                                                                    {hasVoted ? "Quitar voto" : "Votar 👍"}
                                                                </Button>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                )}

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 2, width: "100%" }}
                                    justifyContent="center"
                                    flexWrap="wrap"
                                >
                                    {(event.allow_proposals || event.created_by === user?.username) && (
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#5CB6FF", borderRadius: 3 }}
                                            onClick={() => handleOpenMovieModal(event.id)}
                                        >
                                            PROPON TU PELÍCULA
                                        </Button>
                                    )}

                                    {isLoggedIn && user.is_superuser && (
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#5CB6FF", borderRadius: 3 }}
                                            onClick={() => handleEditEvent(event)}
                                        >
                                            Editar
                                        </Button>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Stack>

            <Dialog
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                fullWidth
            >
                <DialogTitle>{isEditing ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Stack spacing={2}>
                            <TextField
                                label="Título del evento"
                                name="titulo"
                                value={form.titulo}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                label="Fecha del evento"
                                type="date"
                                name="fecha"
                                value={form.fecha}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                label="Convocatoria"
                                type="time"
                                name="horaConvocatoria"
                                value={form.horaConvocatoria}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                label="Proyección"
                                type="time"
                                name="horaInicio"
                                value={form.horaInicio}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                label="Descripción"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                required
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={form.allowProposals}
                                        onChange={handleSwitchChange}
                                    />
                                }
                                label={
                                    form.allowProposals ? "Permitir propuestas" : "Dictadura"
                                }
                            />
                            {error && <FormHelperText error>{error}</FormHelperText>}
                        </Stack>
                    </DialogContent>

                    <DialogActions
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 1.5,
                            justifyContent: "flex-end",
                            alignItems: { xs: "stretch", sm: "center" },
                            px: { xs: 2, sm: 3 },
                            pb: { xs: 2, sm: 3 },
                            "& .MuiButton-root": {
                                width: { xs: "100%", sm: "auto" },
                                m: 0,
                            },
                        }}
                    >
                        {isEditing && (
                            <Button
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteEvent}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                            >
                                Borrar evento
                            </Button>
                        )}

                        <Button
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                            }}
                            color="secondary"
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {isEditing ? "Guardar cambios" : "Crear"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <MovieSearchModal
                open={openMovieModal}
                onClose={handleCloseMovieModal}
                eventId={selectedEventId}
                addProposalToEvent={addProposalToEvent}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Events;
