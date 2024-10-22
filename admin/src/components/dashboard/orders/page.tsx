'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import './orders.css';

import { assets, url } from '@/assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

interface Order {
  _id: string;
  items: { name: string; quantity: number }[];
  address: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    phone: string;
  };
  amount: number;
  status: string;
}

interface RemoveFoodResponse {
  success: boolean;
  message: string;
}

interface OrderListResponse {
  success: boolean;
  message: string;
  data: Order[];
}

interface StatusResponse {
  success: boolean;
  message: string;
}

export default function Orders(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get<OrderListResponse>(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching all the orders');
      }
    } catch (error) {
      toast.error('Error fetching all the orders');
    }
  };

  const statusHandler = async (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    try {
      const response = await axios.post<StatusResponse>(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders(); // Await the fetch call
      }
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const removeOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post<RemoveFoodResponse>(`${url}/api/order/remove`, { id: orderId });
        if (response.data.success) {
          await fetchAllOrders(); // Await the fetch call
          await Swal.fire('Deleted!', 'The order has been deleted.', 'success');
        } else {
          toast.error('Error occurred when removing the order');
        }
      } catch (error) {
        toast.error('Error occurred when removing the order');
      }
    }
  };

  useEffect(() => {
    void fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">
            {' '}
            {/* Use unique order._id as key */}
            <Image src={assets.parcelIcon} alt="Parcel Icon" width={50} height={50} />
            <div>
              <p className="order-item-food">
                {order.items.map((item) => (
                  <span key={`${item.name}-${item.quantity}`}>
                    {' '}
                    {/* Use item name and quantity as key */}
                    {item.name} x {item.quantity}
                    {order.items.length > 1 ? ', ' : ''} {/* Ensure concatenation is with strings */}
                  </span>
                ))}
              </p>
              <p className="order-item-name">
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.country}, {order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button type="button" onClick={() => removeOrder(order._id)}>
              Delete
            </button>{' '}
            {/* Added type="button" */}
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}
