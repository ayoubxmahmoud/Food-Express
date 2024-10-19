"use client";

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Orders from '@/components/dashboard/orders/page';

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {/* Adjusting for responsive layouts */}
        <Grid lg={12} md={10} xs={12}> {/* Adjusting width per breakpoint */}
          <Orders />
        </Grid>
      </Grid>
    </Stack>
  );
}
