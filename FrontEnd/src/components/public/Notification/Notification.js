// Notification.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Notification.module.css'; 

export const notifyInfo = (message) => toast.info(message);
export const notifySuccess = (message) => toast.success(message);
export const notifyWarning = (message) => toast.warn(message);
export const notifyError = (message) => toast.error(message);

const Notification = () => (
  <ToastContainer 
    position="bottom-center"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export default Notification;
