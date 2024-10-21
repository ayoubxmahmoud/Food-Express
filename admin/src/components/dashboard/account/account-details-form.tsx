import * as React from 'react';
import { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select'; // Updated type-only import
import { toast, ToastContainer } from 'react-toastify';
import { InputLabel, MenuItem, FormControl, Select, Button, Stack, OutlinedInput } from '@mui/material';
import axios from 'axios';
import type { CountryCode } from 'libphonenumber-js'; // Updated type-only import

interface Country {
  code: string;
  name: string;
}

interface City {
  name: string;
}

interface AccountDetailsProps {
  // Define any props you need here
}

export function AccountDetailsForm(props: AccountDetailsProps): React.JSX.Element {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch countries and admin data on mount
    fetchCountries();
    fetchAdminData();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Failed to fetch countries:', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/api/admin-data');
      setAdminData(response.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    fetchCitiesByCountry(country);
  };

  const fetchCitiesByCountry = async (countryCode: string) => {
    try {
      const response = await axios.get(`/api/cities?country=${countryCode}`);
      setCities(response.data);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  const handleCityChange = (e: SelectChangeEvent<string>) => {
    setSelectedCity(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/update-account', {
        country: selectedCountry,
        city: selectedCity,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        setError(response.data.message || 'Failed to update account details.');
      }
    } catch (err) {
      console.error('Error updating account details:', err);
      setError('An error occurred while updating account details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={selectedCountry}
            onChange={handleCountryChange}
            input={<OutlinedInput label="Country" />}
            required
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={handleCityChange}
            input={<OutlinedInput label="City" />}
            required
          >
            {cities.map((city) => (
              <MenuItem key={city.name} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Update Details
        </Button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Stack>

      <ToastContainer />
    </form>
  );
}
