import React from 'react';
import { Skeleton, Grid, Box } from '@mui/material';

const SkeletonLoading = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={0.5}>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 3 }}>
          <Skeleton variant="rounded" height={400} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkeletonLoading;
