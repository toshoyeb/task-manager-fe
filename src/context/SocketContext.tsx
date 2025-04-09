import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  Message,
  User,
  ChatState,
  SocketMessage,
  TypingStatus,
} from "../types/chat";

interface SocketContextType {
  socket: Socket | null;
  chatState: ChatState;
  sendMessage: (message: SocketMessage) => void;
  markMessageAsRead: (messageId: string) => void;
  setTypingStatus: (receiverId: string, isTyping: boolean) => void;
  setCurrentChat: (user: User | null) => void;
  isConnected: boolean;
}

const initialState: ChatState = {
  messages: [],
  currentChat: null,
  onlineUsers: [],
  typingUsers: [],
  unreadCounts: {},
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatState, setChatState] = useState<ChatState>(initialState);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.VITE_API_URL || "http://localhost:5000", {
      withCredentials: true,
      autoConnect: false,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newMessage", onNewMessage);
    socket.on("messageRead", onMessageRead);
    socket.on("userOnline", onUserOnline);
    socket.on("userOffline", onUserOffline);
    socket.on("typing", onTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newMessage", onNewMessage);
      socket.off("messageRead", onMessageRead);
      socket.off("userOnline", onUserOnline);
      socket.off("userOffline", onUserOffline);
      socket.off("typing", onTyping);
    };
  }, [socket]);

  // Handlers
  const onConnect = () => {
    console.log("Connected to socket server");
    setIsConnected(true);
  };

  const onDisconnect = () => {
    console.log("Disconnected from socket server");
    setIsConnected(false);
  };

  const onNewMessage = (message: Message) => {
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      unreadCounts: {
        ...prev.unreadCounts,
        [message.sender._id]: (prev.unreadCounts[message.sender._id] || 0) + 1,
      },
    }));
  };

  const onMessageRead = (messageId: string) => {
    setChatState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ),
    }));
  };

  const onUserOnline = (userId: string) => {
    setChatState((prev) => ({
      ...prev,
      onlineUsers: [...prev.onlineUsers, userId],
    }));
  };

  const onUserOffline = (userId: string) => {
    setChatState((prev) => ({
      ...prev,
      onlineUsers: prev.onlineUsers.filter((id) => id !== userId),
    }));
  };

  const onTyping = ({ userId, isTyping }: TypingStatus) => {
    setChatState((prev) => ({
      ...prev,
      typingUsers: isTyping
        ? [...prev.typingUsers, userId]
        : prev.typingUsers.filter((id) => id !== userId),
    }));
  };

  const sendMessage = useCallback(
    (message: SocketMessage) => {
      if (!socket) return;
      socket.emit("sendMessage", message);
    },
    [socket]
  );

  const markMessageAsRead = useCallback(
    (messageId: string) => {
      if (!socket) return;
      socket.emit("markAsRead", messageId);
    },
    [socket]
  );

  const setTypingStatus = useCallback(
    (receiverId: string, isTyping: boolean) => {
      if (!socket) return;
      socket.emit("typing", { receiverId, isTyping });
    },
    [socket]
  );

  const setCurrentChat = useCallback((user: User | null) => {
    setChatState((prev) => ({
      ...prev,
      currentChat: user,
      unreadCounts: {
        ...prev.unreadCounts,
        [user?._id ?? ""]: 0,
      },
    }));
  }, []);

  // Memoize value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      socket,
      chatState,
      sendMessage,
      markMessageAsRead,
      setTypingStatus,
      setCurrentChat,
      isConnected,
    }),
    [
      socket,
      chatState,
      sendMessage,
      markMessageAsRead,
      setTypingStatus,
      setCurrentChat,
      isConnected,
    ]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
