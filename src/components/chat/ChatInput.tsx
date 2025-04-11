import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineAttachFile } from "react-icons/md";

interface ChatInputProps {
  receiverId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ receiverId }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { sendMessage, setTypingStatus } = useSocket();
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle outside click to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle typing status
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      setTypingStatus(receiverId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        setTypingStatus(receiverId, false);
      }
    }, 2000); // Stop typing after 2 seconds of inactivity

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, receiverId, setTypingStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage({
      receiverId,
      text: message.trim(),
      type: "text",
    });

    setMessage("");
    setShowEmojiPicker(false);
    setIsTyping(false);
    setTypingStatus(receiverId, false);

    // Focus back on input after sending
    inputRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex items-center">
      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
      >
        <BsEmojiSmile className="text-xl" />
      </button>

      <button
        type="button"
        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
      >
        <MdOutlineAttachFile className="text-xl" />
      </button>

      <div className="relative flex-1 mx-2">
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-10" ref={emojiPickerRef}>
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              set="apple"
            />
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="w-full p-2 rounded-full border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-2 rounded-full ${
          message.trim()
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <IoMdSend className="text-xl" />
      </button>
    </form>
  );
};

export default ChatInput;
