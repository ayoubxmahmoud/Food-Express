'use client';

import * as React from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { url } from '@/assets/assets';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export function UpdatePasswordForm(): React.JSX.Element | null {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleResetPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    // Your existing code...

    try {
      const response = await axios.post<ResetPasswordResponse>(`${url}/api/admin/auth/reset-password`, {
        password,
        token,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      // Redirect to login after successful reset
      window.location.href = '/auth/sign-in';
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return null; // Or show a loading spinner
  }

  const isPasswordMismatch = password !== confirmPassword;

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Update your password</Typography>
      <form onSubmit={handleResetPassword}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <FormControl error={Boolean(error)}>
            <InputLabel>New Password</InputLabel>
            <OutlinedInput
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="New Password"
              required
            />
          </FormControl>

          <FormControl error={isPasswordMismatch}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              label="Confirm Password"
              required
            />
            {isPasswordMismatch && <FormHelperText>Passwords do not match</FormHelperText>}
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

