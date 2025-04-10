import React from "react";
import ChatContainer from "../components/chat/ChatContainer"; // Assuming ChatContainer wraps Sidebar and Window
import MainLayout from "../components/layout/MainLayout";

const ChatPage: React.FC = () => {
  return (
    <MainLayout>
      {/* Wrap ChatContainer in a div if needed for specific layout adjustments */}
      {/* Or potentially remove MainLayout if ChatContainer provides full-page layout */}
      <ChatContainer />
    </MainLayout>
  );
};

export default ChatPage;
