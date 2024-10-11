import * as React from 'react';

import type { AdminContextValue } from '@/contexts/admin-context';
import { AdminContext } from '@/contexts/admin-context';

export function useAdmin(): AdminContextValue {
  const context = React.useContext(AdminContext);

  if (!context) {
    throw new Error('useAdmin must be used within a AdminProvider');
  }

  return context;
}
