 import axios from "axios";
axios.defaults.withCredentials = true;
  const axiosInstance=axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials:true,
 });

 export default axiosInstance;