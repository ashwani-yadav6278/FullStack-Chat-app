 import axios from "axios";

  const axiosInstance=axios.create({
    baseURL: import.meta.env.MODE === "development" ?  "https://full-stack-chat-app-liart.vercel.app/api" :"/api",
    withCredentials:true,
 });

 export default axiosInstance;