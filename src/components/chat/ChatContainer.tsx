import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { User } from "../../types/chat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";

const ChatContainer: React.FC = () => {
  const { chatState, setCurrentChat, isConnected } = useSocket();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

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
        <ChatSidebar onSelectUser={handleSelectUser} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {chatState.currentChat ? (
          <>
            <ChatHeader
              user={chatState.currentChat}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <ChatMessages messages={chatState.messages} />
            <div ref={messagesEndRef} />
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
