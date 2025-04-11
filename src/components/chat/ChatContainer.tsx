import React, { useState, useMemo } from "react";
import { useSocket } from "../../context/SocketContext";
import { User /* , Message */ } from "../../types/chat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import { useAppSelector } from "../../hooks/reduxHooks";

const ChatContainer: React.FC = () => {
  const { chatState, setCurrentChat, isConnected } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user: loggedInUser } = useAppSelector((state) => state.auth);
  const selectedUser = chatState.currentChat;
  const loggedInUserId = loggedInUser?._id;

  const filteredMessages = useMemo(() => {
    if (!selectedUser || !loggedInUser) {
      return [];
    }
    return chatState.messages.filter(
      (msg) =>
        (msg.sender._id === loggedInUser._id &&
          msg.receiver._id === selectedUser._id) ||
        (msg.receiver._id === loggedInUser._id &&
          msg.sender._id === selectedUser._id)
    );
  }, [chatState.messages, selectedUser, loggedInUser]);

  const handleSelectUser = (user: User) => {
    setCurrentChat(user);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } md:w-80 transition-all duration-300 overflow-hidden`}
      >
        <ChatSidebar
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUser?._id || null}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <ChatHeader
              user={selectedUser}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <ChatMessages
              messages={filteredMessages}
              loggedInUserId={loggedInUserId}
            />
            <ChatInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600">
                Select a chat to start messaging
              </h2>
              <p className="text-gray-500 mt-2">
                {isConnected
                  ? "Connected to chat server"
                  : "Connecting to chat server..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
