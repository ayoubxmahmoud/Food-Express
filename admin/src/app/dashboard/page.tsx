"use client"

import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { Orders } from '@/components/dashboard/overview/orders';
import { TotalItems } from '@/components/dashboard/overview/total-items';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalOrders } from '@/components/dashboard/overview/total-orders';
import axios from 'axios';
import { url } from '@/assets/assets';
import { toast, ToastContainer } from 'react-toastify';


export default function Page(): React.JSX.Element {
  const [totalCustomers, setTotalCustomers] = React.useState('');
  const [totalItems, setTotalItems] = React.useState('');
  const [totatlOrders, setTotalOrders] = React.useState('');

  const fetchTotal = async () => {
    try {
      const response1 = await axios.get(url+"/api/user/size");
      if (response1.data.size){        
        setTotalCustomers(response1.data.size)
      }

      const response2 = await axios.get(url+"/api/food/size");
      if (response2.data.size){
        setTotalItems(response2.data.size)
      }

      const response3 = await axios.get(url+"/api/order/size");
      if (response3.data.size){
        setTotalOrders(response3.data.size)
      }
    } catch (error) {
      toast.error("Failed to fetch the Total!")
    }
  }  
  React.useEffect(() => {
    fetchTotal();
  }, []);
  
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={18} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={totalCustomers} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalItems  sx={{ height: '100%' }} value={totalItems} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalOrders sx={{ height: '100%' }} value={totatlOrders} />
      </Grid>
      <Grid lg={8} xs={12}>
        <Orders
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <ToastContainer />
    </Grid>
  );
}
