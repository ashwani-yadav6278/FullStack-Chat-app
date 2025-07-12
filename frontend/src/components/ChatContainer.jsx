import React, { useEffect,useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeltons/MessageSkeleton";
import { useAuthStore } from "../store/authStore";
import { formatMessageTime } from "../lib/utils";


const ChatContainer = () => {
  const { getMessages, selectedUser, messages, isMessageLoading,subscribeToMessages,unSubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
const bottomRef = useRef(null);

  useEffect(() => {

  if (!selectedUser?._id) return;
 console.log("📡 ChatContainer effect running for user:", selectedUser._id);
  getMessages(selectedUser._id);
console.log("🔌 Subscribing to socket newMessage listener");
  subscribeToMessages(); // set listener once

  return () => {
     console.log("❌ Unsubscribing from socket newMessage listener");
    unSubscribeFromMessages(); // cleanup
  }
  }, [selectedUser._id]);


  useEffect(() => {
  if (bottomRef.current && messages) {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId=== authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar ">
              <div className="rounded-full size-10 border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                alt="profilepic"/>
              </div>
            </div>
            <div className="chat-header mb-3">
              <time className="text-xs opacity-50 ml-1 ">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col  ">
              {message.image && (
                <img src={message.image}
                alt="attachment"
                className="sm:max-w-[200px] rounded-md mb-2 "/>
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
