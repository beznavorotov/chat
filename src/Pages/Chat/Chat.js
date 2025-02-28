import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  addUserToFirestore,
  removeUserFromFirestore,
  subscribeToUsers,
  subscribeToMessages,
  sendMessage,
  deleteMessage,
  clearChat,
  setUserOffline,
} from "../../services/chatService";
import ChatHeader from "../../components/ChatHeader/ChatHeader";
import ChatWindow from "../../components/ChatWindow";
import UserList from "../../components/UserList";
import MessageInput from "../../components/MessageInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const inactivityTimeoutRef = useRef(null); 

  useEffect(() => {
    addUserToFirestore();
    const unsubscribeUsers = subscribeToUsers(setUsers);
    const unsubscribeMessages = subscribeToMessages(setMessages);

    return () => {
      unsubscribeUsers();
      unsubscribeMessages();
    };
  }, []);

  // Автовихід через 10 хвилин неактивності
  const handleAutoLogout = useCallback(async () => {
    toast.info("Ви автоматично вийшли через 10 хвилин неактивності.");
    await removeUserFromFirestore();
    navigate("/login");
  }, [navigate]);

  // Функція для обнулення таймера при активності
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(handleAutoLogout, 10 * 60 * 1000);
  }, [handleAutoLogout]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [resetInactivityTimer]);

  // Оновлення статусу при закритті вкладки
  useEffect(() => {
    const handleBeforeUnload = async () => {
      await setUserOffline();
      await removeUserFromFirestore();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <ChatHeader onSignOut={removeUserFromFirestore} />
      <div className="chat-content">
        <ChatWindow messages={messages} onDeleteMessage={deleteMessage} />
        <UserList users={users} />
      </div>
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        onClearChat={() => clearChat(messages)}
      />
    </div>
  );
};

export default Chat;
