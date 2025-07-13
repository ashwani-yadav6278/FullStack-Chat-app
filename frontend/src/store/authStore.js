import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


// Not include  `/api` here; Socket.IO needs the root server URL
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";



export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  isCheckingAuth: true,
  isResetPassword:false,

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
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup authStore :", error.message);
      toast.error(error?.response?.data?.message || "Signup Failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("User logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      set({ isLogingIn: false });
    }
  },

  resetPassword:async(data)=>{
      
    set({isResetPassword:true})
    try {
      const res= await axiosInstance.post("/auth/update-password",data);
      set({authUser:res.data});
      
      toast.success("Password reset successfully");
      
      
      return true;
    } catch (error) {
      const message = error?.response?.data?.message || "Password reset failed";
    toast.error(message); //  Show backend error to user
    throw new Error(message); //  So UI knows it failed
    }finally{
      set({isResetPassword:false})
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("User logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.log("Profile update error:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket) return;

    const socket = io(Base_Url, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true,
    });

    // Wait for proper connection before logging
    socket.on("connect", () => {
      
      set({ socket });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("getOnlineUsers", (userIds) => {

      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      
    }
    set({ socket: null });
  },
}));
