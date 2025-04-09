export interface User {
  _id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen?: Date;
  unreadCount?: number;
}

export interface Message {
  _id: string;
  text: string;
  sender: User;
  receiver: User;
  timestamp: Date;
  isRead: boolean;
  type: "text" | "image" | "file" | "voice";
  fileUrl?: string;
}

export interface ChatState {
  currentChat: User | null;
  messages: Message[];
  onlineUsers: string[];
  unreadCounts: Record<string, number>;
  typingUsers: string[];
}

export interface SocketMessage {
  type: "text" | "image" | "file" | "voice";
  text: string;
  receiverId: string;
  fileUrl?: string;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
}
