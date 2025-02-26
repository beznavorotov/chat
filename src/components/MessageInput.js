import React from 'react';
import './../Pages/Chat/Chat.css';

const MessageInput = ({ message, setMessage, onSendMessage, onClearChat }) => {
    const handleSendMessage = () => {
        const trimmedMessage = message.trim();
        if (trimmedMessage === '/clear') {
            onClearChat();
            setMessage('');
        } else if (trimmedMessage) {
            onSendMessage();
            setMessage('');
        }
    };

    return (
        <div className="input-group mt-3 mb-3">
            <input 
                type="text" 
                placeholder="Ваше повідомлення..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
                className="form-control"
            />
            <button className="button-68 ms-2 me-3" onClick={handleSendMessage}>
                Відправити
            </button>
        </div>
    );
};

export default MessageInput;
