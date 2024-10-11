import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'


// Create the root element for rendering the React application
ReactDOM.createRoot(document.getElementById('root')).render(

  // Wrap the entire application in a BrowserRouter component
  <BrowserRouter>
  <StoreContextProvider>
    <App />
  </StoreContextProvider>
  </BrowserRouter>

)