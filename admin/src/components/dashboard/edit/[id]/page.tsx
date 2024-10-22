'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './edit.css';
import { url } from '../../../../assets/assets';
import 'react-toastify/dist/ReactToastify.css';

interface FoodResponse {
  success: boolean;
  message: string;
  food: Food;
}

interface Food {
  name: string
  description: string,
  price: number,
  image: string,
  category: string
}
export default function Edit(): React.JSX.Element {
  const [image, setImage] = useState<File | null>(null); // Now holds the file
  const [data, setData] = useState({
    image: '',
    name: '',
    description: '',
    price: 0,
    category: 'Salad',
  });
  const { id } = useParams();

  // Wrap fetchFoodItem in useCallback
  const fetchFoodItem = useCallback(async () => {
    try {
      const response = await axios.get<FoodResponse>(`${url}/api/food/get/${id}`);
      if (response.data.success && response.data.food) {
        setData({
          image: response.data.food.image,
          name: response.data.food.name,
          description: response.data.food.description,
          price: response.data.food.price,
          category: response.data.food.category,
        });
        setImage(null); // Reset image state
      } else {
        toast.error('Error fetching food item!');
      }
    } catch (error) {
      toast.error('Error fetching food item!');
    }
  }, [id]); // Add id as a dependency

  useEffect(() => {
      void fetchFoodItem();
  }, [fetchFoodItem]);
  


  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (event.target instanceof HTMLInputElement && event.target.type === 'file') {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fileURL = URL.createObjectURL(file);
        setImage(file); // Store the file itself
        setData((prevData) => ({ ...prevData, image: fileURL })); // Store the image URL for display
      }
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
  // Check if image is not null before appending
  if (image) {
    formData.append('image', image); // Append the actual file, not URL
  }
    try {
      console.log('Updating food item with ID:', id);

      const response = await axios.post<FoodResponse>(`${url}/api/food/update/${id}`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating the food item.');
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image" className="upload-area">
            <img src={image ? URL.createObjectURL(image) : `${url}/images/food/${data.image}`} alt="Upload Area" />
            <span>Change</span>
          </label>
          <input onChange={onChangeHandler} type="file" id="image" name="image" hidden />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows={10}
            cols={40}
            placeholder="Write content here"
          />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Salad">Salad</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Tacos">Tacos</option>
              <option value="Burger">Burger</option>
              <option value="Desserts">Desserts</option>
              <option value="Pizza">Pizza</option>
              <option value="Cake">Cake</option>
              <option value="Pasta">Pasta</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="$20" />
          </div>
        </div>
        <button type="submit" className="add-btn update-btn">
          Update
        </button>
        <button type="button" className="add-btn cancel-btn" onClick={fetchFoodItem}>
          Cancel
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
