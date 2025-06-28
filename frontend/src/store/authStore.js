import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from 'socket.io-client';


const Base_Url=import.meta.env.MODE === "development"? "http://localhost:5000/api":"/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  //  socket
  socket: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth :", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      // for connect from socket
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup authStore :", error.message);
      toast.error(error?.response?.data?.message || "signup Failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("User Logged in successfully");
      // for connect to socket
      get().connectSocket();
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLogingIn: false });
    }
  },

  logout:  () => {
    try {
       axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("User logged out successfully");
      // for disconnect from socket
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.log("Profile update error:", error); //
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: ()=>{
    const {authUser}=get();
    if(!authUser || get().connected) return ;
    const socket=io(Base_Url,{
      query:{
        userId:authUser._id
      }
    })
    socket.connect();
    console.log("✅ Socket connected:", socket.id);
    set({socket:socket})

    // too show Online Users
    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})
    })
  },
  disconnectSocket: ()=>{
    if(get().socket?.connected) get().socket.disconnect();
  },
}));
