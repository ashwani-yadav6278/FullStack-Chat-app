import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeltons/SidebarSkeltons";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Sidebar = () => {
  const {
    getUsers,
    users,
    isUsersLoading,
    getSelectedUser,
    selectedUser,
    unreadMessageCount,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlyOnlineUser, setShowOnlyOnlineUsers,] = useState(false);

  
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlyOnlineUser
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className=" border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online Filter Toggle */}
        <div className="lg:flex mt-3 hidden items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 ">
            <input
              type="checkbox"
              checked={showOnlyOnlineUser}
              onChange={(e) => setShowOnlyOnlineUsers(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm "> Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online){" "}
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 ">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => getSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "profile.jpg"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
              {unreadMessageCount[user._id] > 0 && (
                <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full ml-auto">
                  {unreadMessageCount[user._id]}
                </span>
              )}
            </div>
            {/* User info: Only visible on large screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate ">
                {user.fullName}
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
