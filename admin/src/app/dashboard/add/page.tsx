"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Add from '@/components/dashboard/add/add';

export default function Page(): React.JSX.Element {


  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid lg={8} md={6} xs={12}>
          <Add />
        </Grid>
      </Grid>
    </Stack>
  );
}
