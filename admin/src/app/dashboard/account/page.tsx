"use client"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { assets } from '@/assets/assets'; // Import assets for default avatar

export default function Page(): React.JSX.Element {
  // Lift the avatar state to Page component
  const [avatar, setAvatar] = React.useState<string | Blob>(assets.default_avatar.src); // Set the initial avatar as the default URL


  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          {/* Pass avatar URL and setAvatar to AccountInfo */}
          <AccountInfo avatar={avatar} setAvatar={setAvatar} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          {/* Pass avatar and setAvatar to AccountDetailsForm */}
          <AccountDetailsForm avatar={avatar} setAvatar={setAvatar} />
        </Grid>
      </Grid>
    </Stack>
  );
}
