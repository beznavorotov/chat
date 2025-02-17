import React from 'react';

const ChatHeader = ({ onSignOut }) => (
    <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
        <h1>Чат</h1>
        <button className="btn btn-danger" onClick={onSignOut}>Вихід</button>
    </header>
);

export default ChatHeader;
