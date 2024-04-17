// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://agentprod-backend-framework-9e52.onrender.com",
   // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
  // You can add more default settings here
});

export default axiosInstance;
