import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { User } from "../../types/chat";

const ChatSection: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-[600px] border rounded-lg shadow-sm">
      <div className="w-1/3 border-r">
        <ChatSidebar onSelectUser={handleUserSelect} />
      </div>
      <div className="w-2/3">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatSection;
