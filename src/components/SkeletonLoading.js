import React from 'react';
import { Skeleton, Grid, Box } from '@mui/material';

const SideBySideRectangles = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={0.5}>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} bord/>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SideBySideRectangles;
