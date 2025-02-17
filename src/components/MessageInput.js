import React from 'react';

const MessageInput = ({ message, setMessage, onSendMessage, onClearChat }) => (
    <div className="input-group mt-3">
        <input 
            type="text" 
            placeholder="Ваше повідомлення..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()} 
            className="form-control"
        />
        <button className="btn btn-success" onClick={onSendMessage}>Відправити</button>
        <button className="btn btn-warning" onClick={onClearChat}>Очистити чат</button>
    </div>
);

export default MessageInput;
