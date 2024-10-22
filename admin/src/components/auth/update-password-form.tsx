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
    setError(''); // Reset error before submitting
    setIsPending(true); // Set loading state

    if (!token) {
      setError('Invalid or expired token.');
      setIsPending(false);
      return;
    }

    try {
      const response = await axios.post<ResetPasswordResponse>(`${url}/api/admin/auth/reset-password`, {
        password,
        token,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Redirect to login after successful reset
        window.location.href = '/auth/sign-in';
      } else {
        setError(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return null; // Token validation failed or missing
  }

  // Stable values for rendering conditions
  const showPasswordMismatch = password && confirmPassword && password !== confirmPassword;
  const isFormValid = !showPasswordMismatch && password.length > 0;

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Update your password</Typography>
      <form onSubmit={handleResetPassword}>
        <Stack spacing={2}>
          {Boolean(error) && <Alert severity="error">{error}</Alert>}

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

          {Boolean(password) && Boolean(confirmPassword) && (
                        <FormControl error={Boolean(showPasswordMismatch)}>
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
              {Boolean(showPasswordMismatch) && (
                <FormHelperText>Passwords do not match</FormHelperText>
              )}
            </FormControl>
          )}

          <Button
            disabled={isPending || !isFormValid} // Disable if form is invalid or loading
            type="submit"
            variant="contained"
          >
            {isPending ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Stack>
      </form>
      <ToastContainer />
    </Stack>
  );
}
