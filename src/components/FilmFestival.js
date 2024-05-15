import React from 'react';
import MovieSearch from './MovieSearch';
import MoviesToWatch from './MoviesToWatch';
import FilmsWatched from './FilmsWatched';
import {
    Typography,
} from '@mui/material';

const FilmFestival = () => {
    return (
        <div>
            <Typography variant="h1" component="h1">
                Paral·lel Film Festival
            </Typography>
            <FilmsWatched />
            <MoviesToWatch />
            <MovieSearch />
        </div>
    );
};

export default FilmFestival;
