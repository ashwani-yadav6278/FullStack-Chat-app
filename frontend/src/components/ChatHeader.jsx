import React from "react";
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/authStore";
import { useEffect,useState } from "react";

const ChatHeader = () => {
  const { selectedUser, getSelectedUser } = useChatStore();
  const { onlineUsers, socket, authUser } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !selectedUser) return;
    const handleTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(true);
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(false);
    };
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedUser]);

  return (
    <div className="p-2.5 border-b border-base-300 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 ">
          {/* Avatar */}
          <div className="avatar">
            <div className="rounded-full relative size-10">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-xs text-zinc-400">
              {isTyping ? "Typing..." : onlineUsers.includes(selectedUser._id) ? "Online" :"Offline"}
            </p>
           
          </div>
        </div>
        {/* Close Button */}
        <button onClick={() => getSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 
