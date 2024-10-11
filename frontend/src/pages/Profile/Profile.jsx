import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { assets } from "../../assets/assets.js";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'libphonenumber-js'; // Import parsePhoneNumber to extract region and number


const Profile = ({ setHeader }) => {
  const { url, token } = useContext(StoreContext);
  const [customerData, setCustomerData] = useState({});
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [avatar, setAvatar] = useState(assets.default_avatar); // Set default avatar initially
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regionCode, setRegionCode] = useState(''); // Separate region code

  // Fetch customer data
  const fetchCustomerData = async () => {
    try {
      const response = await axios.post(url + "/api/user/profile", {}, { headers: { token } });
      const customer = response.data.customer || {};
      setCustomerData(customer);
      
      // Fetch countries list before using it
      const response2 = await axios.get(url + "/api/countries/fetch", {});
      const countriesData = response2.data.countries || [];
      setCountries(response2.data.countries || []);
  
      // Fetch cities once countries are available
      const countryFromServer = customer.address?.country;
      if (countryFromServer) {        
        const countryObj = countriesData.find(c => c.name === countryFromServer);  // Match by code
        
        if (countryObj) {
          setSelectedCountry(countryObj.name);  
          setCountryCode(countryObj.code)          
          setCustomerData(prevData => ({
            ...prevData,
            address: {
              ...prevData.address,
              country: countryObj.name, // Save country code
            },
          }));
          setCities(countryObj.cities || []); // Assuming countriesData has city information
        } else {
          setCities([]); // Clear cities if no matching country is found
        }
      }
  
      // Set avatar
      if (customer.avatar) {
        const avatarURL = `${url}/images/avatar/user/${customer.avatar}`;
        setAvatar(avatarURL);
      } else {
        setAvatar(assets.default_avatar);
      }
  
      // Handle phone number and region code
      if (customer.phone) {
        let parsedPhoneNumber;
        try {
          parsedPhoneNumber = parsePhoneNumber(customer.phone);
        } catch (error) {
          console.error("Invalid phone number format", error);
        }
  
        if (parsedPhoneNumber) {
          setPhoneNumber(parsedPhoneNumber.number);
          setRegionCode(parsedPhoneNumber.country);
        } else {
          setPhoneNumber('');
        }
      }
  
      // Set city if available
      if (customer.address?.city) {
        setSelectedCity(customer.address.city);
        setCustomerData(prevData => ({
          ...prevData,
          address: {
            ...prevData.address,
            city: customer.address.city // Ensure city is updated in customerData
          }
        }));
      }    
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    }
  };
  
    

  useEffect(() => {
    if (token) {
      fetchCustomerData();
      setHeader(false);
    }
  }, [setHeader, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      if (addressField == 'country') {
          setSelectedCountry(value); // Set country name
          if (value) {
            const countryObj = countries.find(c => c.name === value);  // Match by name
            setCountryCode(countryObj.code)
        
            if (countryObj){
              setCities(countryObj.cities || []); // Assuming countriesData has city information
              console.log(countryObj);
              
            }
            setPhoneNumber('')
          }else {
            console.log("noo selected coun");
            
          }

      }
      if (addressField == 'city') {
        setSelectedCity(value); // Set country code
      }
      setCustomerData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value
        }
      }));
    } else {
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setAvatar(fileURL);
    }
  };

  const handleUpdateProfile = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData();
      formData.append("name", customerData.name);
      formData.append("email", customerData.email);
      formData.append("phone", phoneNumber);
      formData.append("region_phone", regionCode);

      if (customerData.address) {
        formData.append("street", customerData.address.street || "");
        formData.append("country", customerData.address.country || "");
        formData.append("city", customerData.address.city || "");
      }

      const avatarFile = document.getElementById('avatar').files[0];
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await axios.put(url + "/api/user/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Error updating profile");
    }
  };

 
  return (
    <form className="profile-page" onSubmit={handleUpdateProfile}>
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img 
            className="profile-avatar" 
            src={avatar} 
            alt="Profile Avatar"
            onError={() => setAvatar(assets.default_avatar)}
          />
          <input
            onChange={handleAvatarChange}
            type="file"
            id="avatar"
            name='avatar'
            hidden
          />
          <label htmlFor="avatar" className="upload-picture">Upload picture</label>
        </div>
        <div className="profile-details">
          <h2>{customerData.name || "Your Name"}</h2>
          <p>{(customerData.address?.city || '') + ', ' + (customerData.address?.country || '')}</p>
          <p>{(customerData.address?.street || '')}</p>
        </div>
      </div>
      <div className="profile-form-container">
        <h3>Profile</h3>
        <p>The information can be edited</p>
        <div className="profile-edit">
          <input 
            type="text" 
            name="name" 
            value={customerData.name || ''} 
            onChange={handleInputChange} 
            placeholder="First name"
          />
          <input 
            type="email" 
            name="email" 
            value={customerData.email || ''} 
            onChange={handleInputChange} 
            placeholder="Email"
          />
          <div className="address">
              <p>Address:</p>
            {/* Country Select */}
            <select 
              name="address.country"
              value={selectedCountry || customerData.address?.country}  // Use country name
              onChange={handleInputChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>{country.name}</option>
              ))}
            </select>

            {/* City Select */}
            <select
              name="address.city"
              value={selectedCity || customerData.address?.city}
              onChange={handleInputChange}
            >
              <option value="">Select City</option>
              {selectedCountry && cities?.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <input 
              type="text" 
              name="address.street" 
              value={customerData.address?.street || ''} 
              onChange={handleInputChange} 
              placeholder="Street"
            />
          </div>

          
          {/* Phone Number Input */}
          <PhoneInput
            placeholder="Enter phone number"
            value={phoneNumber} // E.164 format phone number
            onChange={setPhoneNumber} // Updates the phone number
            name="phone"
            defaultCountry={countryCode}  // Use selectedCountry as the default country for phone input
          />


          <button type='submit'>Save details</button>
          <button type='button' onClick={fetchCustomerData}>Cancel</button>
        </div>
      </div>
    </form>
  );
};

export default Profile;
