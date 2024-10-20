import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useAdmin } from '@/hooks/use-admin'; // Update to useAdmin hook
import { assets } from '@/assets/assets';

export interface AdminPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function AdminPopover({ anchorEl, onClose, open }: AdminPopoverProps): React.JSX.Element {
  const { checkSession } = useAdmin(); // Updated from useUser to useAdmin
  const [adminData, setAdminData] = React.useState({
    id: '',
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const loadAdminData = async () => {
    try {
      const response = await authClient.getAdmin(); // Assuming this returns { data: Admin, error: string }
  
      if (response.error) {
        logger.error('Error loading admin data', response.error);
        return;
      }
  
      const admin = response.data;
      if (admin) {
        setAdminData({
          id: admin._id,
          avatar: typeof admin.avatar === 'string' ? admin.avatar : assets.defaultAvatar.src, // Use the URL of the default avatar
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email || '',
        });
      }
    } catch (error) {
      logger.error('Error loading admin data', error);
    }
  };
  
  React.useEffect(() => {
    loadAdminData();
  }, [])

  const router = useRouter();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // AdminProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();
      // After refresh, AuthGuard will handle the redirect
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{adminData.firstName} {adminData.lastName}</Typography>
        <Typography color="text.secondary" variant="body2">
          {adminData.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
