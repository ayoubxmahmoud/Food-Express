"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import './orders.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { assets, url } from '@/assets/assets';
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


export default function Orders(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
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
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error('Error updating order status');
    }
  };
  const removeOrder = async (orderId: string) => {
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
          const response = await axios.post(`${url}/api/order/remove`, { id: orderId });
          if (response.data.success) {
            await fetchAllOrders(); // Refetch the orders
            Swal.fire('Deleted!', 'The order has been deleted.', 'success');
          } else {
            toast.error('Error occurred when removing the order');
          }
        } catch (error) {
          toast.error('Error occurred when removing the order');
        }
      }
    });
  };
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <Image src={assets.parcelIcon} alt="Parcel Icon" width={50} height={50} />
            <div>
              <p className="order-item-food">
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx !== order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className="order-item-name">{order.address.firstName} {order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>{order.address.city}, {order.address.country}, {order.address.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button onClick={() => removeOrder(order._id)}>Delete</button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};
