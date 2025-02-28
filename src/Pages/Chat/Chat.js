import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  addUserToFirestore,
  removeUserFromFirestore,
  subscribeToUsers,
  subscribeToMessages,
  sendMessage,
  setUserOffline,
  removeInactiveUsers,
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

  // Автовихід через 20 хвилин неактивності
  const handleAutoLogout = useCallback(async () => {
    toast.info("Ви автоматично вийшли через 20 хвилин неактивності.");
    await removeUserFromFirestore();
    navigate("/login");
  }, [navigate]);

  // Очищення неактивних користувачів кожні 5 хвилин
  useEffect(() => {
    const interval = setInterval(() => {
      removeInactiveUsers();
    }, 5 * 60 * 1000); // 5 хвилин

    return () => clearInterval(interval);
  }, []);

  // Оновлення статусу при активності
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(handleAutoLogout, 20 * 60 * 1000);
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

  // Встановлюємо статус "offline" при закритті вкладки
  useEffect(() => {
    const handleBeforeUnload = async () => {
      await setUserOffline();
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
        <ChatWindow messages={messages} />
        <UserList users={users} />
      </div>
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
