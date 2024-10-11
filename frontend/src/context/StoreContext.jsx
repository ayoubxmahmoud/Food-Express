import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

//Create a new context called StoreContext with a defalt value of null
export const StoreContext = createContext(null);

// Define a context provider component that will wrap other components
const StoreContextProvider = (props) => {
  // Intialize the cartItems state to store the items in the cart, defaulting to an empty object
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token,setToken] = useState("");
  const [food_list, setFoodList] = useState([])

  const addToCart = async (itemId) => {

    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(`${url}/api/cart/add`, {itemId}, {headers: {token}})
    }
  };
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    await axios.post(`${url}/api/cart/remove`, {itemId}, {headers: {token}})

  };
  const getCart = async (token) => {
    const response = await axios.post(url+"/api/cart/get", {}, {headers: {token}})
    setCartItems(response.data.cartData);
  }
  const getTotalCartAmount = () => {
    let totalAmount = 0;
  
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
  
        if (itemInfo) {  // Check if itemInfo exists
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.warn(`Product with ID ${item} not found in the food list.`);
        }
      }
    }
  
    // Use toFixed(2) to round to two decimal places, and parseFloat to convert it back to a number
    return parseFloat(totalAmount.toFixed(2));
  };
  


  const fetchFoodList = async () => {
    const response = await axios.get(url+"/api/food/list");    
    setFoodList(response.data.foods);
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await getCart(localStorage.getItem("token"));
      }      
    }
    loadData();
  }, [])
  // Define the value that will passed down to all consuming components
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };
  // Return the context provider components
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
