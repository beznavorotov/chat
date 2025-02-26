import React, { useState, useEffect, useCallback } from 'react';
import {
  addUserToFirestore,
  removeUserFromFirestore,
  subscribeToUsers,
  subscribeToMessages,
  sendMessage,
  deleteMessage,
  clearChat
} from '../../services/chatService';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatWindow from '../../components/ChatWindow';
import UserList from '../../components/UserList';
import MessageInput from '../../components/MessageInput';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Chat.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    addUserToFirestore();
    const unsubscribeUsers = subscribeToUsers(setUsers);
    const unsubscribeMessages = subscribeToMessages(setMessages);

    return () => {
      unsubscribeUsers();
      unsubscribeMessages();
    };
  }, []);

  // Стабілізуємо handleAutoLogout за допомогою useCallback
  const handleAutoLogout = useCallback(async () => {
    toast.info('Ви автоматично вийшли через 10 хвилин неактивності.');
    await removeUserFromFirestore();
    navigate('/login');
  }, [navigate]);

  // Автовихід через 30 хвилин неактивності
  useEffect(() => {
    const idleTimeout = 30 * 60 * 1000;
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleAutoLogout, idleTimeout);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [handleAutoLogout]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
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
