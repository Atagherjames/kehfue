import { AES } from "crypto-es";

export const convertTime = (isoTime) => {
  const date = new Date(isoTime);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
};

const SECRET_KEY = "93c542edc90b9125f072685432b591c5"; 

export const encryptPassword = (password) => {
  const ciphertext = AES.encrypt(password, SECRET_KEY).toString();
  return ciphertext;
};