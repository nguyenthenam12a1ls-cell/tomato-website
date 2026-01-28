import React, { useState, useContext, useRef, useEffect } from 'react';
import './Chatbot.css';
import { assets } from '../../assets/assets';
import { faqData } from './faqData.js'; // Import "bộ não"

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Chào bạn! Tôi có thể giúp gì cho bạn?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null); // Ref để tự động cuộn

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    // HÀM XỬ LÝ KHI BẤM NÚT
    const handleOptionClick = (question) => {
        setMessages(prev => [...prev, { from: 'user', text: question }]);
        setIsLoading(true);

        const response = faqData.find(item => item.question === question);
        const answer = response ? response.answer : "Xin lỗi, tôi chưa hiểu câu hỏi này.";

        // Giả vờ "đang gõ"
        setTimeout(() => {
            setIsLoading(false);
            setMessages(prev => [...prev, { from: 'bot', text: answer }]);
        }, 500);
    };

    return (
        <div className="chatbot-container">
            {/* Cửa sổ chat */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <p>Tomato Assistant</p>
                        <img src={assets.cross_icon} alt="Close" onClick={toggleChat} />
                    </div>
                    
                    {/* KHUNG CHAT */}
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.from}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="message bot typing">...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* KHU VỰC CÁC NÚT BẤM */}
                    <div className="chatbot-options">
                        {faqData.map((item, index) => (
                            <button 
                                key={index} 
                                className="chatbot-option-btn"
                                onClick={() => handleOptionClick(item.question)}
                                disabled={isLoading}
                            >
                                {item.question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Nút bong bóng chat */}
            <div className="chatbot-bubble" onClick={toggleChat}>
                {/* (Bạn cần thêm chat_icon vào assets.js nhé) */}
                <img src="/src/assets/chat.png" alt="" /> 
            </div>
        </div>
    );
};

export default Chatbot;