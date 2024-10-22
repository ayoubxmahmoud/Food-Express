'use client';

import { url } from '@/assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define the Admin type based on your schema
interface Address {
  city?: string;
  country?: string;
}

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // In a real application, you probably wouldn't expose this
  avatar?: string; // Avatar URL
  address?: Address;
  phone?: string;
  createdAt?: string;
}
interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

interface GenerateTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
}
interface RefreshTokenResponse {
  success: boolean;
  message: string;
  token: string;
}
interface ProfileResponse {
  success: boolean;
  message: string;
  admin: Admin;
}
interface RegisterResponse {
  success: boolean;
  message: string;
  admin: Admin;
  accessToken: string;
  refreshToken: string;
}
interface SendEmailResponse {
  success: boolean;
  message: string;
}
export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ResetEmailParams {
  email: string;
  token: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post<RegisterResponse>(`${url}/api/admin/register`, params);
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem('custom-auth-token', accessToken); // Store access token
        localStorage.setItem('refresh-token', refreshToken); // Store refresh token
      } else {
        toast.error(response.data.message);
      }
      return {};
    } catch (error: unknown) {
      toast.error('Failed to sign up.');
      return { error: 'Sign up failed' };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post<LoginResponse>(`${url}/api/admin/login`, params);
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        if (accessToken && refreshToken) {
          localStorage.setItem('custom-auth-token', accessToken); // Store access token
          localStorage.setItem('refresh-token', refreshToken); // Store refresh token
          // Redirect to admin dashboard or another page after successful login
          window.location.href = '/dashboard'; // Adjust to your admin dashboard path
        }
      } else {
        return { error: response.data.message };
      }
      return {};
    } catch (error: unknown) {
      return { error: 'Sign in failed' };
    }
  }

  async resetPassword(values: ResetPasswordParams): Promise<{ error?: string }> {
    try {
      const email = values.email;
      console.log('Attempting to reset password for email:', email); // Debugging line
      const response1 = await axios.get<RegisterResponse>(`${url}/api/admin/get`, {
        params: { email },
      });

      console.log('Response from get admin:', response1.data); // Debugging line
      if (response1.data.success) {
        const admin = response1.data.admin;
        // Call the new token generation endpoint
        const tokenResponse = await axios.post<GenerateTokenResponse>(`${url}/api/admin/auth/generate-token`, {
          id: admin._id,
        });
        const token = tokenResponse.data.accessToken; // Get the generated token
        console.log('Generated token:', token); // Debugging line

        const response2 = await axios.post<SendEmailResponse>(`${url}/api/admin/auth/send-email`, { email, token });

        if (!response2.data.success) {
          return { error: response2.data.message };
        }
      } else {
        return { error: response1.data.message };
      }
      return {};
    } catch (error: unknown) {
      const err = error as { response?: { data: { message?: string } }; message?: string };
      console.error('Password reset error: ', err);
      console.error('Full error object:', err.response ? err.response.data : err);
      toast.error('Failed to reset password.');
      return { error: err.message || 'Password reset failed' };
    }
  }

  async getAdmin(): Promise<{ data?: Admin | null; error?: string }> {
    let token = localStorage.getItem('custom-auth-token');
    if (!token) {
      return { data: null };
    }

    try {
      const response = await axios.get<ProfileResponse>(`${url}/api/admin/profile`, {
        headers: { token }, // Provide a fallback for token
      });

      if (response.data.success) {
        const admin = response.data.admin || null;
        return { data: admin };
      }
      toast.error(response.data.message);
      return { data: null };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      // Check for token expiration error
      if (err.response?.data?.message === 'Token expired') {
        const refreshToken = localStorage.getItem('refresh-token');

        if (refreshToken) {
          try {
            const refreshResponse = await axios.post<RefreshTokenResponse>(`${url}/api/admin/auth/refresh-token`, {
              refreshToken,
            });

            if (refreshResponse.data.success && refreshResponse.data.token) {
              token = refreshResponse.data.token; // Get the new token
              localStorage.setItem('custom-auth-token', token); // Save the new token
            }
          } catch (refreshError) {
            // Handle any errors during the refresh process
            console.error('Error refreshing token:', refreshError);
            window.location.href = '/auth/sign-in'; // Redirect to login on refresh error
          }
        } else {
          // No refresh token available
          window.location.href = '/auth/sign-in'; // Redirect to login
        }
      }

      toast.error('Failed to fetch admin profile.'); // General error message
      return { error: 'Fetch admin profile failed' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update password not implemented' };
  }
}

export const authClient = new AuthClient();
