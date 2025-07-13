 import axios from "axios";
axios.defaults.withCredentials = true;
  const axiosInstance=axios.create({
    baseURL: "https://full-stack-chat-app-delta.vercel.app/api",
    withCredentials:true,
 });

 export default axiosInstance;