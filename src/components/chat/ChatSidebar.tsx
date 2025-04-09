import React, { useState } from "react";
import { User } from "../../types/chat";

interface ChatSidebarProps {
  onSelectUser: (user: User) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const users: User[] = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      isOnline: true,
      unreadCount: 2,
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      isOnline: false,
      lastSeen: new Date(),
      unreadCount: 0,
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user.isOnline ? "Online" : "Offline"}
                </p>
              </div>
              {user.unreadCount && user.unreadCount > 0 && (
                <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {user.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
