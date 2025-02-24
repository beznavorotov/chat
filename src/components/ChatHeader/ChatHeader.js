import React from 'react';
import { signOut, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './ChatHeader.css';

const ChatHeader = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error("Помилка виходу:", error);
        }
    };

    return (
        <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
            <h1>CHAT BEZNAVOROTOV</h1>
            <button className="button-24" onClick={handleSignOut}>Вихід</button>
        </header>
    );
};

export default ChatHeader;
