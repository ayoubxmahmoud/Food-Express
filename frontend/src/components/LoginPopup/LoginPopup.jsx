import React, { useContext, useEffect, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };
  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Your email"
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              placeholder="Password"
              required
            />
            <button
              className="eye-button"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <i class="fa fa-eye-slash" aria-hidden="true"></i> : <i class="fa-solid fa-eye"></i>}
            </button>
          </div>
        </div>
        <div className="login-popup-condition">
          <input type="checkbox" id="check" required />
          <label htmlFor="check">By continuing, i agree to the terms of use & privacy policy</label>
        </div>
        <button type="submit">
          {currState === "Sign up" ? "Create account" : "Login"}
        </button>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
