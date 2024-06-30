// Notification.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Notification.module.css'; 

export const notifyInfo = (message) => {
  toast.info(message, {
    position: "top-right"
  });
};

export const notifySuccess = (message) => {
  toast.success(message, {
    position: "bottom-center"
  });
};

export const notifyWarning = (message) => {
  toast.warn(message, {
    position: "top-center"
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: "middle-center",
  });
};

const Notification = () => (
  <ToastContainer className={styles.Toastify__toast}
    autoClose={3000}
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
