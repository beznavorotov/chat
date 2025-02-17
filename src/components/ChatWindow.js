import React from 'react';
import { auth } from '../firebase';

const ChatWindow = ({ messages, onDeleteMessage }) => (
    <div className="chat-window">
        {messages.map((msg) => (
            <div key={msg.id} className="chat-message">
                <strong>{msg.user}:</strong> {msg.text}
                {msg.user === auth.currentUser.displayName && (
                    <button className="btn btn-link" onClick={() => onDeleteMessage(msg.id)}>Видалити</button>
                )}
            </div>
        ))}
    </div>
);

export default ChatWindow;
