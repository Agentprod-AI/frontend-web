// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
  // You can add more default settings here
});

export default axiosInstance;
