import { toast as rht } from "react-hot-toast";

const options = {
  duration: 3000,
  position: "top-right",
};

const success = (msg) => {
  return rht.success(msg, options);
};

const error = (msg) => {
  return rht.error(msg, options);
};

// Custom warning using icon and styles
const warning = (msg) => {
  return rht(msg, {
    ...options,
    icon: "⚠️",
    style: {
      background: "#ffffff",
      color: "#92400e",
    },
  });
};

const promise = (myPromise, msgObj) => {
  return rht.promise(myPromise, msgObj, options);
};

const toast = {
  success,
  error,
  warning,
  promise,
};

export default toast;
