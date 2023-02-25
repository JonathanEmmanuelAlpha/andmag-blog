import React from "react";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CLOSE_DELAY = 1000 * 5;

export const showSuccessToast = (msg, loading = false) => {
  toast.success(msg || `Success !`, {
    position: "top-right",
    autoClose: CLOSE_DELAY,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    isLoading: loading,
  });
};

export const showErrorToast = (msg, loading = false) => {
  toast.error(msg || `Something went wrong! Please try again.`, {
    position: "top-right",
    autoClose: CLOSE_DELAY,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    isLoading: loading,
  });
};

export const showInfoToast = (msg, loading = false) => {
  toast.info(msg || `Informations handle.`, {
    position: "top-right",
    autoClose: CLOSE_DELAY,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    isLoading: loading,
  });
};

export const showWarningToast = (msg, loading = false) => {
  toast.warning(msg || `Bad practice! Please avoid this`, {
    position: "top-right",
    autoClose: CLOSE_DELAY,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    isLoading: loading,
  });
};

function ToasComponent({ closeDelay, position, hideProgress }) {
  return (
    <ToastContainer
      position={position || "top-right"}
      autoClose={closeDelay || CLOSE_DELAY}
      hideProgressBar={hideProgress || false}
    />
  );
}

ToasComponent.propTypes = {};

export default ToasComponent;
