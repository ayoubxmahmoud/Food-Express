"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import List from '@/components/dashboard/items/items';

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
        <Grid lg={8} md={6} xs={12}>
          {/* Pass avatar and setAvatar to AccountDetailsForm */}
          <List />
        </Grid>
    </Stack>
  );
}
