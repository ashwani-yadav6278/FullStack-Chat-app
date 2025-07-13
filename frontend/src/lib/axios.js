 import axios from "axios";

  const axiosInstance=axios.create({
    baseURL:"https://full-stack-chat-app-liart.vercel.app/",
    withCredentials:true,
 });

 export default axiosInstance;