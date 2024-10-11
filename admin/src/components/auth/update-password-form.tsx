'use client';

import * as React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams from next/navigation
import axios from 'axios';
import { Stack, Typography, Button, FormControl, InputLabel, OutlinedInput, FormHelperText, Alert } from '@mui/material';
import { url } from '@/assets/assets';
import { toast, ToastContainer } from 'react-toastify';

export function UpdatePasswordForm(): React.JSX.Element | null {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams(); // Get search params using useSearchParams
  const token = searchParams.get('token'); // Extract token from search params
  console.log("token is : ",token);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsPending(true);
    setError('');

    try {
      const response = await axios.post(url + '/api/admin/auth/reset-password', { password, token });
      if (response.data.success) {
        console.log("yeees");
        
        toast.success(response.data.message);
      } else {
        console.log("nooo");
        
        toast.error(response.data.message);
      }
      // Redirect to login after successful reset
      window.location.href = '/auth/sign-in'; 
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return null; // Or show a loading spinner
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Update your password</Typography>
      <form onSubmit={handleResetPassword}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl error={Boolean(error && password === confirmPassword)}>
            <InputLabel>New Password</InputLabel>
            <OutlinedInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="New Password"
              required
            />
          </FormControl>

          <FormControl error={Boolean(error && password !== confirmPassword)}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              required
            />
            {password !== confirmPassword && <FormHelperText>Passwords do not match</FormHelperText>}
          </FormControl>

          <Button disabled={isPending} type="submit" variant="contained">
            Reset Password
          </Button>
        </Stack>
      </form>
      <ToastContainer />
    </Stack>
  );
}
