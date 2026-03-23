export const mobileRegex = /^\+?[1-9]\d{8,14}$/;

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/;

export const alphabetsRegex = /^[a-zA-Z]+$/;

export const numberRegex = /^[0-9]+$/;
// Or if you want to allow empty input (e.g., while typing): /^[0-9]*$/

export const floatingPointNumberRegex = /^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/;

export const zipCodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;
