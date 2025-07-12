import { create } from "zustand";

import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: null,
  isMessagesLoading: null,
  unreadMessageCount: {},

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsers useChatStore:", error.messages);
      toast.error(error.response.data.messages);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages in useChatStore:", error.messages);
      toast.error(error.response.data.messages);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error in sendMessage in useChatStore:", error.messages);
      toast.error(error.response.data.messageData);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    if (!socket || !authUser) {
      console.warn("❗ Socket or authUser missing. Skipping subscription.");
      return;
    }
    socket.off("newMessage"); // clean previous listener
    console.log("🧲 Attaching listener to socket");

    socket.on("newMessage", (newMessage) => {
      console.log("📥 New message received:", newMessage); // 🔥 Check if this ever fires
      const { selectedUser, messages } = get(); // always get fresh state

      console.log("📌 Current selected user:", selectedUser?._id);
      console.log("🧠 Auth user:", authUser._id);

      const isCurrentChat =
        (newMessage.senderId === selectedUser?._id &&
          newMessage.receiverId === authUser._id) ||
        (newMessage.receiverId === selectedUser?._id &&
          newMessage.senderId === authUser._id);
      console.log("🟢 Is current chat?", isCurrentChat);

      if (isCurrentChat) {
        console.log("✅ Appending to current messages");
        set({ messages: [...messages, newMessage] });
      } else {
        console.log("New message for another chat. Ignored.");
        get().increamentUnreadCoount(newMessage.senderId);
        console.log("📩 New message for another chat. Count +1");
      }
    });
    console.log("✅ Listener attached to socket");
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // to do optimize later
  getSelectedUser: (selectedUser) => {
    set({ selectedUser });
    get().getMessages(selectedUser._id);
    get().resetUnreadMessageCount(selectedUser._id);
  },

  setUnreadCounts: (counts) => ({ unreadMessageCount: counts }),
  increamentUnreadCoount: (userId) =>
    set((state) => ({
      unreadMessageCount: {
        ...state.unreadMessageCount,
        [userId]: (state.unreadMessageCount[userId] || 0) + 1,
      },
    })),
  resetUnreadMessageCount: (userId) =>
    set((state) => ({
      unreadMessageCount: { ...state.unreadMessageCount, [userId]: 0 },
    })),
}));
