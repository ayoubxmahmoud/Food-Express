'use client';

import * as React from 'react';
import { assets, url } from '@/assets/assets'; // Importing url for constructing the avatar path
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { usePopover } from '@/hooks/use-popover';

import { AdminPopover } from './admin-popover';
import { MobileNav } from './mobile-nav';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();
  const [adminAvatar, setAdminAvatar] = React.useState<string>(''); // State for avatar URL

  const loadAdminData = async () => {
    try {
      let token = localStorage.getItem('custom-auth-token');
      if (token) {
        const response = await authClient.getAdmin();

        // Check if response.data exists and is not null
        if (response.data) {
          const avatarUrl = response.data.avatar
            ? `${url}/images/avatar/admin/${response.data.avatar}`
            : assets.defaultAvatar.src;

          setAdminAvatar(avatarUrl); // Set the constructed avatar URL
        } else {
          logger.warn('No admin data found');
        }
      }
    } catch (error) {
      logger.error('Error loading admin data', error);
    }
  };

  React.useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <IconButton onClick={() => setOpenNav(true)} sx={{ display: { lg: 'none' } }}>
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={adminAvatar || assets.defaultAvatar.src} // Use the constructed avatar URL or default
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <AdminPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
      <MobileNav onClose={() => setOpenNav(false)} open={openNav} />
    </React.Fragment>
  );
}
