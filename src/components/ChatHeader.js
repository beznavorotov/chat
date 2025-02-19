import React from 'react';
import { signOut, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ChatHeader = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
            <h1>Чат</h1>
            <button className="btn btn-danger" onClick={handleSignOut}>Вихід</button>
        </header>
    );
};

export default ChatHeader;
