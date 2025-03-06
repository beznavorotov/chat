import React from 'react';
import './../Pages/Chat/Chat.css';

const MessageInput = ({ message, setMessage, onSendMessage, onClearChat }) => {
    const handleSendMessage = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;  // Якщо повідомлення порожнє — вихід

        if (trimmedMessage === '/clear') {
            onClearChat();          // Викликаємо очищення чату
            setMessage('');         // Очищаємо поле вводу
        } else {
            onSendMessage();        // Відправляємо повідомлення
            setMessage('');         // Очищаємо поле вводу
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();    // Відправка при натисканні Enter
        }
    };

    return (
        <div className="input-group mt-3 mb-3">
            <input 
                type="text" 
                placeholder="Ваше повідомлення..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={handleKeyDown}
                className="form-control"
                autoFocus
            />
            <button 
                className="button-68 ms-2 me-3" 
                onClick={handleSendMessage}
                disabled={!message.trim()}   // Вимикаємо кнопку, якщо порожньо
            >
                Відправити
            </button>
        </div>
    );
};

export default MessageInput;
