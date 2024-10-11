import * as React from 'react';
import { assets, url } from '@/assets/assets'; // Import assets for default avatar
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

// Define Address interface
interface Address {
  country?: string; // Allow undefined
  city?: string; // Allow undefined
}

// Define Admin interface
interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // phone can be optional
  avatar: string;
  address: Address;
}

interface AccountInfoProps {
  avatar: string | Blob; // URL of the avatar or Blob (uploaded file)
  setAvatar: React.Dispatch<React.SetStateAction<string | Blob>>; // Updated to allow string (URL) or Blob (File)
}

export function AccountInfo({ avatar, setAvatar }: AccountInfoProps): React.JSX.Element {
  const [adminData, setAdminData] = React.useState<Admin>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Initialize as an empty string
    avatar: '',
    address: {
      country: '',
      city: '',
    },
  });

  const fetchAdminData = async () => {
    try {
      const response = await authClient.getAdmin(); // Fetch the admin data

      // Check if response.data exists and is not null
      if (response.data) {
        const admin = response.data; // TypeScript now understands admin is Admin or null

        // Construct the avatar URL
        const avatarUrl = admin.avatar ? `${url}/images/avatar/admin/${admin.avatar}` : assets.default_avatar.src;

        // Set admin data, ensuring it's typed correctly
        setAdminData({
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          avatar: avatarUrl,
          phone: admin.phone || '', // Provide a default empty string
          address: {
            country: admin.address?.country,
            city: admin.address?.city,
          },
        });
      } else {
        // Handle the case where admin data is null
        logger.warn('No admin data found');
      }
    } catch (error) {
      logger.error('Error loading admin data', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Ensure that a file is selected
    if (file) {
      setAvatar(file); // Store the file URL
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('custom-auth-token');
    if (token) {
      fetchAdminData();
    }
  }, []);

  // Check if avatar is a Blob, convert to URL if necessary
  const avatarSrc = typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <Avatar
              src={avatarSrc || adminData.avatar} // Ensure correct type for src
              sx={{ height: '80px', width: '80px' }}
            />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{`${adminData.firstName} ${adminData.lastName}`}</Typography>
            <Typography color="text.secondary" variant="body2">
              {`${adminData.address.city}, ${adminData.address.country}`} {/* Display location */}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider sx={{ width: '100%', margin: '10px 0' }} />
      <CardActions sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <input onChange={handleAvatarChange} type="file" id="avatar" name="avatar" hidden />
        <label htmlFor="avatar" className="upload-picture" style={{ cursor: 'pointer' }}>
          Upload picture
        </label>
      </CardActions>
    </Card>
  );
}
