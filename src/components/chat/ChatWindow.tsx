import React, { useState, useEffect, useRef } from "react";
import { User, Message } from "../../types/chat";
import { format } from "date-fns";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useSocket } from "../../context/SocketContext";

interface ChatWindowProps {
  selectedUser: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { chatState, socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChatMessages = chatState.messages.filter(
    (msg) =>
      (msg.sender._id === chatState.currentChat?._id &&
        msg.receiver._id === selectedUser?._id) ||
      (msg.receiver._id === chatState.currentChat?._id &&
        msg.sender._id === selectedUser?._id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const addEmoji = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {selectedUser.name.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500">
            {selectedUser.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChatMessages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === chatState.currentChat?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender._id === chatState.currentChat?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender._id === chatState.currentChat?._id
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {format(new Date(message.timestamp), "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
