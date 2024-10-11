import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'; // Importing axios for making HTTP requests
import { useNavigate } from 'react-router-dom';

// Define the placeOrder component
const PlaceOrder = ({setHeader}) => {
  // Using the useContext hook to access data and functions from the StoreContext
  const { getTotalCartAmount,token,food_list,cartItems,url } = useContext(StoreContext);
  // State to hold user input data for the order form
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  // Handler function to update the state when the user types into form fields
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]:value}))
  }

  // function to handle placing the order
  const placeOrder = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    let orderItems = []; // Initialize an empty array to hold order items
    // Iterate throught the food list and add items that are in the cart
    food_list.map((item) => {
      if(cartItems[item._id] > 0){ // Check if the item is in the cart
        let itemInfo = item; // copy the item information
        itemInfo["quantity"] = cartItems[item._id]; // Add the quantity to the itemInfo
        orderItems.push(itemInfo)
      }
    })
    // Create the order data to be sent to the backend
    let orderData = {
      address:data,
      items: orderItems,
      amount: getTotalCartAmount()+2
    }
    console.log(orderData);
    
    // Sent a Post request to the backend API to place the order
    let response = await axios.post(url+"/api/order/place", orderData, {headers:{token}})
    
    // If the order is placed successfully, redirect the user to the Stripe session URL
    if (response.data.success) {
      const {session_url} = response.data;
      window.location.replace(session_url)
    }else{
      alert("Error,failed placing the order")
    }

  }
  const navigate = useNavigate()
  useEffect(() => {
    if(!token || getTotalCartAmount()===0) {
      navigate('/cart')
      setHeader(false)
    }
  }, [token])

  return (
    <form className='place-order' id='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount()===0?0:2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Total</p>
                <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
              </div>
            </div>
            <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder