import React from "react";

const CardVendor = (props) => {
  return (
    <svg
    {...props}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect opacity="0.2" width="60" height="60" rx="12" fill="#4ACDD9" />
      <path
        d="M15 42.5263C14.9999 40.2574 15.6545 38.0365 16.8854 36.1304C18.1162 34.2242 19.8709 32.7138 21.939 31.7802C24.0071 30.8467 26.3006 30.5298 28.5443 30.8675C30.788 31.2053 32.8866 32.1833 34.5882 33.6842"
        stroke="#28B3E2"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M26.7896 30.7369C30.859 30.7369 34.158 27.4379 34.158 23.3684C34.158 19.299 30.859 16 26.7896 16C22.7201 16 19.4211 19.299 19.4211 23.3684C19.4211 27.4379 22.7201 30.7369 26.7896 30.7369Z"
        stroke="#28B3E2"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M40.0527 35.1578V44"
        stroke="#B3E5F6"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M44.4737 39.579H35.6316"
        stroke="#B3E5F6"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default CardVendor;
