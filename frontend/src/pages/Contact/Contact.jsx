import React, { useContext, useEffect, useState } from "react";
import "./Contact.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify"

const Contact = ({ setHeader, setShowLogin }) => {
    const {url, token} = useContext(StoreContext)
  const [data, setData] = useState({
    username: "",
    email: "",
    subject: "",
    message: ""
  })
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]:value}))
  }
  const sendMessage = async (event) => {
    event.preventDefault();

    // create the contact data to be sent to the backend
    let contactData = data;

    if (token) {
        let response = await axios.post(url+"/api/contact/send_message", contactData, {headers:{token}});
        if (response.data.success){
            setData({
                username: "",
                email: "",
                subject: "",
                message: ""
            })
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }
    }else{
        setShowLogin(true)
    }
  } 

  useEffect(() => {
    setHeader(false);
  }, [setHeader]);

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h5 className="main-title">Contact Us</h5>
        <h1>Contact For Any Query</h1>
      </div>
      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-item">
            <h5 className="section-title">Booking</h5>
            <p><i className="fa fa-envelope-open"></i> book@example.com</p>
          </div>
          <div className="contact-item">
            <h5 className="section-title">General</h5>
            <p><i className="fa fa-envelope-open"></i> info@example.com</p>
          </div>
          <div className="contact-item">
            <h5 className="section-title">Technical</h5>
            <p><i className="fa fa-envelope-open"></i> tech@example.com</p>
          </div>
        </div>
        <div className="contact-form-map">
          <div className="contact-map">
          <iframe
            className="map-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55057.636522225184!2d-9.60495498228786!3d30.40483979032613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b784ccb8245f%3A0x82e358fa0ee2cc9e!2sGLOVO%20AGADIR!5e0!3m2!1sen!2sma!4v1726490480590!5m2!1sen!2sma"
            frameBorder="0"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            ></iframe>
          </div>
          <div className="contact-form">
            <form onSubmit={sendMessage}>
              <div className="form-group">
                <input type="text" className="form-input" id="name" name="username" onChange={onChangeHandler} value={data.username} placeholder="your name" required/>
                <label htmlFor="name" className="form-label">Name</label>
              </div>
              <div className="form-group">
                <input type="email" className="form-input" id="email" name="email" onChange={onChangeHandler} value={data.email} placeholder="your email" required/>
                <label htmlFor="email" className="form-label">Email</label>
              </div>
              <div className="form-group">
                <input type="text" className="form-input" id="subject" name="subject" onChange={onChangeHandler} value={data.subject} placeholder="subject" required/>
                <label htmlFor="subject" className="form-label">Subject</label>
              </div>
              <div className="form-group">
                <textarea className="form-input" id="message" name="message" onChange={onChangeHandler} value={data.message} placeholder="Leave a message here" style={{ height: "150px" }} required></textarea>
                <label htmlFor="message" className="form-label">Message</label>
              </div>
              <button className="submit-btn" type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;