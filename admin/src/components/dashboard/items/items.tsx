'use client';

import React, { useEffect, useRef, useState } from 'react';

import './list.css';

import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import { assets, url } from '../../../assets/assets';

import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/navigation'; // Correct hook for app directory

import { faEdit, faXmark } from '@fortawesome/free-solid-svg-icons'; // Import the edit and trash icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

import { paths } from '@/paths';

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  foods?: FoodItem[];
}

export default function List(): React.JSX.Element {
  const [list, setList] = useState<FoodItem[]>([]);
  const router = useRouter(); // Use the correct router hook from next/navigation
  const myRef = useRef<HTMLDivElement>(null);

  // Fetch the list of foods from the API
  const fetchList = async () => {
    try {
      const response = await axios.get<ApiResponse>(`${url}/api/food/list`);
      if (response.data.success && response.data.foods) {
        setList(response.data.foods);
      } else {
        toast.error('Error fetching data!');
      }
    } catch (error) {
      toast.error('Error fetching data!');
    }
  };

  // Remove a food item from the list
  const removeFood = async (foodId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post<ApiResponse>(`${url}/api/food/remove`, { id: foodId });
          if (response.data.success) {
            await fetchList(); // Refetch the list after deletion
            Swal.fire('Deleted!', 'Your food item has been deleted.', 'success');
          } else {
            toast.error('Error occurred when removing food item');
          }
        } catch (error) {
          toast.error('Error occurred when removing food item');
        }
      }
    });
  };

  useEffect(() => {
    fetchList(); // Fetch the food list on component mount

    if (myRef.current) {
      console.log(myRef.current); // Ensure the ref is available
    }
  }, []);

  return (
    <div ref={myRef} className="list add flex-col">
      <h2>All Foods List</h2>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${url}/images/food/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <div className="action">
              <p className="edit-item" onClick={() => router.push(`${paths.dashboard.edit}/${item._id}`)}>
                <FontAwesomeIcon icon={faEdit} />{' '}
              </p>
              <p onClick={() => removeFood(item._id)} className="remove-item">
                <FontAwesomeIcon icon={faXmark} />
              </p>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
