'use client';

import * as React from 'react';
import type { Admin } from '@/types/admin'; // Assuming you have a type for Admin
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface AdminContextValue {
  admin: Admin | null;
  error: string | null; // Error must either be a string or null
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const AdminContext = React.createContext<AdminContextValue | undefined>(undefined);

export interface AdminProviderProps {
  children: React.ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ admin: Admin | null; error: string | null; isLoading: boolean }>({
    admin: null,
    error: null,
    isLoading: true,
  });
  const [token, setToken] = React.useState<string | null>(null);

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await authClient.getAdmin(); // Assuming you have a getAdmin() method

      if (error) {
        logger.error(error);
        setState((prev) => ({
          ...prev,
          admin: null,
          error: 'Something went wrong', // Make sure error is a string
          isLoading: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        admin: data as Admin, // Explicitly tell TypeScript that 'data' conforms to 'Admin'
        error: null,
        isLoading: false,
      }));
      
    } catch (err) {
      logger.error(err);
      setState((prev) => ({
        ...prev,
        admin: null,
        error: 'Something went wrong', // Error should always be a string or null
        isLoading: false,
      }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });

    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return (
    <AdminContext.Provider value={{ ...state, checkSession }}>
      {children}
    </AdminContext.Provider>
  );
}

export const AdminConsumer = AdminContext.Consumer;
