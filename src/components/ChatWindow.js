import React, { useEffect, useRef } from 'react';
import { auth } from '../firebase';
import deleteIcon from './../icons/delete.png';
import './../Pages/Chat/Chat.css';

const ChatWindow = ({ messages, onDeleteMessage }) => {
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-window" ref={chatRef}>
            {messages.map((msg) => (
                <div key={msg.id} className="chat-message">
                    <strong>{msg.user}:</strong> {msg.text}
                    {msg.user === auth.currentUser.displayName && (
                        <button
                            className="btn btn-link"
                            onClick={() => onDeleteMessage(msg.id)}
                        >
                            <img src={deleteIcon} alt="Delete" className='delete-icon' />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;
