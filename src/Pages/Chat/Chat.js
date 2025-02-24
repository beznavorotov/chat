import React, { useState, useEffect } from 'react';
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
import './Chat.css';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        addUserToFirestore();
        const unsubscribeUsers = subscribeToUsers(setUsers);
        const unsubscribeMessages = subscribeToMessages(setMessages);

        return () => {
            unsubscribeUsers();
            unsubscribeMessages();
        };
    }, []);

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
