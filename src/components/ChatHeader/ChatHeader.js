import React from 'react';
import { removeUserFromFirestore } from '../../services/chatService';
import { useNavigate } from 'react-router-dom';
import './ChatHeader.css';

const ChatHeader = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await removeUserFromFirestore();
            navigate('/login');
        } catch (error) {
            console.error("Помилка виходу:", error);
        }
    };

    return (
        <header className="d-flex justify-content-between align-items-center p-3 chat-header">
            <h1>CHAT BEZNAVOROTOV</h1>
            <button className="button-24" onClick={handleSignOut}>Вихід</button>
        </header>
    );
};

export default ChatHeader;

