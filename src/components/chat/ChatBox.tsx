import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { RootState } from "../../store/store";
import {
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
} from "../../store/slices/chatSlice";
import { Message, User } from "../../types/chat";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineAttachFile } from "react-icons/md";

interface ChatBoxProps {
  selectedUserId: string | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ selectedUserId }) => {
  const dispatch = useDispatch();
  const { users, messages, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchMessages(selectedUserId) as any);
      dispatch(markMessagesAsRead(selectedUserId) as any);
    }
  }, [selectedUserId, dispatch]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && newMessage.trim()) {
      dispatch(
        sendMessage({
          receiverId: selectedUserId,
          text: newMessage.trim(),
          type: "text",
        }) as any
      );
      setNewMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const addEmoji = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const selectedUser: User | undefined = users.find(
    (user) => user._id === selectedUserId
  );

  const currentConversation = selectedUserId
    ? (messages || []).filter(
        (msg) =>
          (msg.sender._id === selectedUserId &&
            msg.receiver._id === currentUser?._id) ||
          (msg.sender._id === currentUser?._id &&
            msg.receiver._id === selectedUserId)
      )
    : [];

  if (!selectedUserId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Welcome to the Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (loading && currentConversation.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative mr-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <span className="text-lg font-semibold text-gray-700">
              {selectedUser?.name?.charAt(0)}
            </span>
          </div>
          {selectedUser?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-800 dark:text-white">
            {selectedUser?.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedUser?.isOnline
              ? "Online"
              : selectedUser?.lastSeen
              ? `Last seen ${format(
                  new Date(selectedUser.lastSeen),
                  "MMM d, h:mm a"
                )}`
              : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.map((msg: Message) => {
          const isCurrentUser = msg.sender._id === currentUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {format(new Date(msg.timestamp), "h:mm a")}
                  {isCurrentUser && (
                    <span className="ml-1">{msg.isRead ? "✓✓" : "✓"}</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowEmojiPicker(!showEmojiPicker);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <BsEmojiSmile className="text-xl" />
          </button>

          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <MdOutlineAttachFile className="text-xl" />
          </button>

          <div className="relative flex-1">
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0">
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  theme="light"
                  set="apple"
                />
              </div>
            )}

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              newMessage.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <IoMdSend className="text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
