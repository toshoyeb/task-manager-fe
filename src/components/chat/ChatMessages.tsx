import React, { useEffect, useRef } from "react";
import { Message /* , User */ } from "../../types/chat";
import { useSocket } from "../../context/SocketContext";
import { format } from "date-fns";

interface ChatMessagesProps {
  messages: Message[];
  loggedInUserId: string | undefined;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loggedInUserId,
}) => {
  const { /* chatState, */ markMessageAsRead } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-message-id");
            if (messageId) {
              const msg = messages.find((m) => m._id === messageId);
              if (msg && msg.sender._id !== loggedInUserId) {
                markMessageAsRead(messageId);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    messages.forEach((message) => {
      const element = document.querySelector(
        `[data-message-id="${message._id}"]`
      );
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [messages, markMessageAsRead, loggedInUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender._id === loggedInUserId;
        const messageDate = new Date(message.timestamp);

        return (
          <div
            key={message._id}
            data-message-id={message._id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwnMessage
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {message.type === "text" && (
                <p className="text-sm">{message.text}</p>
              )}
              {message.type === "image" && (
                <img
                  src={message.fileUrl}
                  alt={`Shared content from ${message.sender.name}`}
                  className="max-w-full rounded"
                />
              )}
              {message.type === "file" && (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm underline"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Download File
                </a>
              )}
              {message.type === "voice" && (
                <audio controls className="w-full">
                  <source src={message.fileUrl} type="audio/mpeg" />
                  <track kind="metadata" src="" />
                  Your browser does not support the audio element.
                </audio>
              )}
              <div
                className={`text-xs mt-1 ${
                  isOwnMessage ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {format(messageDate, "h:mm a")}
                {isOwnMessage && (
                  <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
