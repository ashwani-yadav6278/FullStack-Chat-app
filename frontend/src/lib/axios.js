 import axios from "axios";

  const axiosInstance=axios.create({
    baseURL:["https://full-stack-chat-app-liart.vercel.app/api","http://localhost:5000/api"],
    withCredentials:true,
 });

 export default axiosInstance;