import React from "react";

const UserIcon = (props) => {
  return (
    <svg
      {...props}
      width="36"
      height="37"
      viewBox="0 0 36 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        d="M25 28V26C25 24.9391 24.5786 23.9217 23.8284 23.1716C23.0783 22.4214 22.0609 22 21 22H15C13.9391 22 12.9217 22.4214 12.1716 23.1716C11.4214 23.9217 11 24.9391 11 26V28"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill="none"
        d="M18 18C20.2091 18 22 16.2091 22 14C22 11.7909 20.2091 10 18 10C15.7909 10 14 11.7909 14 14C14 16.2091 15.7909 18 18 18Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UserIcon;
