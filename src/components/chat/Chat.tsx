import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { User } from "../../types/chat";

const Chat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full md:w-1/3 border-r border-gray-200">
        <ChatSidebar
          onSelectUser={handleUserSelect}
          selectedUserId={selectedUser?._id || null}
        />
      </div>
      <div className="w-full md:w-2/3">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Chat;
