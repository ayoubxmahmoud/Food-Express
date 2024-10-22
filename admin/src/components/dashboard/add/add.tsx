'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { assets, url } from '../../../assets/assets';

interface AddFoodResponse {
  success: boolean,
  message: string
}
export default function Add(): React.JSX.Element {
  const [image, setImage] = useState<File | null>(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: 0.00,
    category: '',
  });

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      toast.error('Please upload an image.');
      return;
    }
    if (!data.category){
      toast.error('Please select an category.');
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('image', image);

    try {
      const response = await axios.post<AddFoodResponse>(`${url}/api/food/add`, formData);

      if (response.data.success) {
        setData({
          name: '',
          description: '',
          price: 0,
          category: '',
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while adding the product.');
    }
  };

  return (
    <Card>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <CardContent>
          <InputLabel>Upload Image</InputLabel>
          <FormControl
            fullWidth
            required
            sx={{
              width: '20%', // Set the width to 20%
              borderRadius: '8px', // Optional: Border radius for appearance
            }}
          >
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : (assets.uploadArea.src as unknown as string)}
                alt="Upload Area"
                style={{ height: '120px', width: '125px', cursor: 'pointer' }}
              />
            </label>
            <input
              onChange={(e) => {
                if (e.target.files) setImage(e.target.files[0]);
              }}
              type="file"
              id="image"
              hidden
            />
          </FormControl>

          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Product Description"
            name="description"
            value={data.description}
            onChange={onChangeHandler}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <FormControl fullWidth margin="normal" variant="standard" required>
            <InputLabel>Product Category</InputLabel>
            <Select name="category" value={data.category || 'category'} onChange={onChangeHandler}>
              <MenuItem value="category">select category</MenuItem>
              <MenuItem value="Salad">Salad</MenuItem>
              <MenuItem value="Sandwich">Sandwich</MenuItem>
              <MenuItem value="Tacos">Tacos</MenuItem>
              <MenuItem value="Burger">Burger</MenuItem>
              <MenuItem value="Desserts">Desserts</MenuItem>
              <MenuItem value="Pizza">Pizza</MenuItem>
              <MenuItem value="Cake">Cake</MenuItem>
              <MenuItem value="Pasta">Pasta</MenuItem>
              <MenuItem value="Drinks">Drinks</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Product Price ($)"
            name="price"
            value={data.price}
            onChange={onChangeHandler}
            type="number"
            margin="normal"
            required
          />
        </CardContent>

        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              marginLeft: '16px', // Adds padding to the left
            }}
          >
            ADD
          </Button>
        </CardActions>
      </form>
      <ToastContainer />
    </Card>
  );
}
