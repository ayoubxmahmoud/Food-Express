'use client';

import * as React from 'react';
import { url } from '@/assets/assets';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js'; // Import parsePhoneNumber to extract region and number

import './account.css';
import 'react-phone-number-input/style.css';

import PhoneInput from 'react-phone-number-input';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;
interface AccountDetailsFormProps {
  avatar: string | Blob; // Updated to allow StaticImageData
  setAvatar: React.Dispatch<React.SetStateAction<string | Blob>>; // Updated to allow StaticImageData
}
interface Country {
  name: string;
  code: string;
  cities: string[]; // Array of cities}
}
interface City {}
export function AccountDetailsForm({ avatar, setAvatar }: AccountDetailsFormProps): React.JSX.Element {
  const [adminData, setAdminData] = React.useState({
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
  const [selectedCity, setSelectedCity] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [regionCode, setRegionCode] = React.useState(''); // Separate region code

  // Fetch customer data
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('custom-auth-token');
      const response = await axios.get(url + '/api/admin/profile', { headers: { token } });
      const admin = response.data.admin || {};
      setAdminData(admin);

      // Fetch countries list before using it
      const response2 = await axios.get(url + '/api/countries/fetch', {});
      const countriesData = response2.data.countries || [];
      setCountries(response2.data.countries || []);

      // Fetch cities once countries are available
      const countryFromServer = admin.address?.country;
      if (countryFromServer) {
        const countryObj = countriesData.find((c: Country) => c.name === countryFromServer); // Match by code

        if (countryObj) {
          setSelectedCountry(countryObj.name);
          setCountryCode(countryObj.code);
          setCities(countryObj.cities || []); // Assuming countriesData has city information
        } else {
          setCities([]); // Clear cities if no matching country is found
        }
      }

      // Set avatar
      if (admin.avatar) {
        const avatarURL = `${url}/images/avatar/admin/${admin.avatar}`;
        setAvatar(avatarURL);
      }

      // Handle phone number and region code
      if (admin.phone && admin.phone !== 'undefined') {
        let parsedPhoneNumber;
        parsedPhoneNumber = parsePhoneNumber(admin.phone);

        if (parsedPhoneNumber) {
          setPhoneNumber(parsedPhoneNumber.number ?? '');
          setRegionCode(parsedPhoneNumber.country ?? '');
        }
      } else {
        setPhoneNumber('');
      }

      // Set city if available
      if (admin.address?.city) {
        setSelectedCity(admin.address.city);
        // check this +-
        setAdminData((prevData) => ({
          ...prevData,
          address: {
            ...prevData.address,
            city: admin.address.city, // Ensure city is updated in adminData
          },
        }));
      }
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('custom-auth-token');
    if (token) {
      fetchAdminData();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    if (name && name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      if (addressField == 'country') {
        setSelectedCountry(value); // Set country name

        if (value) {
          const countryObj = countries.find((c: Country) => c.name === value); // Match by name

          if (countryObj) {
            setCities(countryObj.cities || []); // Assuming countriesData has city information
            setCountryCode(countryObj.code)
            console.log(countryObj);
          }
          setPhoneNumber('');
        } else {
          console.log('noo selected coun');
        }
      }
      if (addressField == 'city') {
        setSelectedCity(value); // Set city name
      }
      setAdminData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      console.log(name + '/' + value);

      setAdminData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
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
      const response = await axios.put(url + '/api/admin/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
        },
      });

      if (response.data.success) {
        console.log('success');
        toast.success(response.data.message);

        // Reload the page after a successful update
        window.location.reload();
      } else {
        console.log('Failed');
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth variant="standard">
                  {' '}
                  {/* Or variant="filled" */}
                  <InputLabel id="select-country-label">Country</InputLabel>
                  <Select
                    labelId="select-country-label"
                    name="address.country"
                    value={selectedCountry || ''}
                    onChange={handleInputChange}
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
                    value={selectedCity || ''} // Default to an empty string
                    onChange={(e: SelectChangeEvent<string>) => handleInputChange(e)}
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
                  {/* Phone Number Input */}
                  <PhoneInput
                    className="phone-input"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || '')}
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
