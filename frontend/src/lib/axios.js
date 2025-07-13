 import axios from "axios";

  const axiosInstance=axios.create({
    baseURL: "https://full-stack-chat-app-sage.vercel.app/api",
    withCredentials:true,
 });

 export default axiosInstance;