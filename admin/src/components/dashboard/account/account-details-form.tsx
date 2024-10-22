'use client';

import * as React from 'react';
import { url } from '@/assets/assets';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { parsePhoneNumber } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js'; // Use type-only import

import './account.css';
import 'react-phone-number-input/style.css';

import PhoneInput from 'react-phone-number-input';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { logger } from '@/lib/default-logger';

interface AccountDetailsFormProps {
  avatar: string | Blob;
  setAvatar: React.Dispatch<React.SetStateAction<string | Blob>>;
}

interface Country {
  name: string;
  code: string;
  cities: string[];
}

interface Admin {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
  address: {
    country: string;
    city: string;
  };
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

export function AccountDetailsForm({ avatar, setAvatar }: AccountDetailsFormProps): React.JSX.Element {
  const [adminData, setAdminData] = React.useState<Admin>({
    firstName: '',
    lastName: '',
    avatar: '',
    email: '',
    phone: '',
    address: {
      country: '',
      city: '',
    },
  });

  const [countries, setCountries] = React.useState<Country[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const [countryCode, setCountryCode] = React.useState<string>('');
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [regionCode, setRegionCode] = React.useState<string>('');

  const fetchAdminData = React.useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const response = await axios.get<{ admin: Admin }>(`${url}/api/admin/profile`, { headers: { token } });
      const admin = response.data.admin || {};
      setAdminData(admin);

      const response2 = await axios.get<{ countries: Country[] }>(`${url}/api/countries/fetch`);
      setCountries(response2.data.countries || []);

      const countryFromServer = admin.address?.country;
      if (countryFromServer) {
        const countryObj = response2.data.countries.find((c: Country) => c.name === countryFromServer);
        if (countryObj) {
          setSelectedCountry(countryObj.name);
          setCountryCode(countryObj.code);
          setCities(countryObj.cities || []);
        } else {
          setCities([]);
        }
      }

      if (admin.avatar) {
        const avatarURL = `${url}/images/avatar/admin/${admin.avatar}`;
        setAvatar(avatarURL);
      }

      if (admin.phone && admin.phone !== 'undefined') {
        const parsedPhoneNumber = parsePhoneNumber(admin.phone);
        if (parsedPhoneNumber) {
          setPhoneNumber(parsedPhoneNumber.number ?? '');
          setRegionCode(parsedPhoneNumber.country ?? '');
        }
      } else {
        setPhoneNumber('');
      }

      if (admin.address?.city) {
        setSelectedCity(admin.address.city);
      }
    } catch (error) {
      logger.error('Failed to fetch profile data', error);
    }
  }, [setAvatar]);

  React.useEffect(() => {
    const token = localStorage.getItem('custom-auth-token');
    if (token) {
      void fetchAdminData();
    }
  }, [fetchAdminData]);

// For handling input and textarea changes
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setAdminData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

// For handling select changes
const handleSelectChange = (e: SelectChangeEvent) => {
  const { name, value } = e.target;

  if (name?.startsWith('address.')) {
    const addressField = name.split('.')[1];
    if (addressField === 'country') {
      setSelectedCountry(value);
      const countryObj = countries.find((c: Country) => c.name === value);
      if (countryObj) {
        setCities(countryObj.cities || []);
        setCountryCode(countryObj.code);
        setPhoneNumber(''); // Reset phone number when the country changes
      }
    } else if (addressField === 'city') {
      setSelectedCity(value);
    }

    setAdminData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [addressField]: value,
      },
    }));
  } else {
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};


  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      const formData = new FormData();
      formData.append('firstName', adminData.firstName);
      formData.append('lastName', adminData.lastName);
      formData.append('email', adminData.email);
      formData.append('phone', phoneNumber);
      formData.append('region_phone', regionCode);

      if (adminData.address) {
        formData.append('country', adminData.address.country || '');
        formData.append('city', adminData.address.city || '');
      }
      formData.append('avatar', avatar);

      const token = localStorage.getItem('custom-auth-token');
      const response = await axios.put<UpdateProfileResponse>(`${url}/api/admin/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      logger.error('Failed to update profile', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleUpdateProfile}>
        <Card>
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>First name</InputLabel>
                  <OutlinedInput
                    value={adminData.firstName || ''}
                    label="First name"
                    name="firstName"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Last name</InputLabel>
                  <OutlinedInput
                    value={adminData.lastName || ''}
                    label="Last name"
                    name="lastName"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput
                    value={adminData.email || ''}
                    label="Email address"
                    name="email"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="select-country-label">Country</InputLabel>
                  <Select
                    labelId="select-country-label"
                    name="address.country"
                    value={selectedCountry || ''}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">
                      <em>Select Country</em>
                    </MenuItem>
                    {countries.map((country) => (
                      <MenuItem key={country.code} value={country.name}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel>City</InputLabel>
                  <Select
                    labelId="select-city-label"
                    name="address.city"
                    value={selectedCity || ''}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">
                      <em>Select City</em>
                    </MenuItem>
                    {selectedCountry && cities.length > 0 ? (
                      cities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No cities available
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <PhoneInput
                    className="phone-input"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value || '');
                    }}
                    name="phone"
                    defaultCountry={countryCode as CountryCode}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">
              Save details
            </Button>
            <Button
              onClick={fetchAdminData}
              variant="contained"
              sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
            >
              Cancel Changes
            </Button>
          </CardActions>
        </Card>
      </form>
    </>
  );
}
