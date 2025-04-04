import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css'; // We'll include the styles separately
import axios from 'axios'
import { FaMessage } from "react-icons/fa6";
import { ImCross } from "react-icons/im";

// API of backend url its like http://127.45.8.187:8000 we have store it in constants and we have to import it and use it here 

const API_URL = 'http://127.45.8.187:8000'
const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'incoming',
      content: 'Hi there \nHow can i help you today??'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const chatboxRef = useRef(null);
  const textareaRef = useRef(null);
  const inputInitHeight = useRef(null);




  useEffect(() => {
    if (textareaRef.current) {
      inputInitHeight.current = textareaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatboxRef.current) {
      chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
    }
  }, [messages]);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = `${inputInitHeight.current}px`;
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const generateResponse = async (userMessage) => {
    // requesting for  response to chat 
    const res = await axios.post(`${API_URL}/get-response`, userMessage);
    if (res.status === 200) {
      return {
        type: 'incoming',
        content: res.data.response
      };
    } else {
      return {
        type: 'incoming',
        content: 'Sorry, I couldn\'t understand your request. Please try again.'
      };
    }
  };

  const handleSendMessage = async () => {
    const userMessage = inputMessage.trim();
    if (!userMessage) return;

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'outgoing', content: userMessage }]);
    setInputMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = `${inputInitHeight.current}px`;
    }

    // Add loading message
    setMessages(prev => [...prev, { type: 'incoming', content: '..' }]);

    // Generate response after a delay
    setTimeout(async () => {
      const responseMessage = await generateResponse(userMessage);

      // Replace loading message with actual response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = responseMessage;
        return newMessages;
      });
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        className={`chatbot-toggler ${showChatbot ? 'active' : ''}`}
        onClick={toggleChatbot}
      >
        <span className="material-symbols-rounded">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <FaMessage style={{ fontSize: '30px' }} />
          </div>
          </span>
        <span className="material-symbols-outlined">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ImCross style={{ fontSize: '30px' }} />
          </div>
        </span>
      </button>

      <div className={`chatbot ${showChatbot ? 'show' : ''}`}>
        <header>
          <h2>VJ Jyothi Chatbot</h2>
          <span
            className="close-btn material-symbols-outlined"
            onClick={() => setShowChatbot(false)}
          >
            close
          </span>
        </header>

        <ul className="chatbox" ref={chatboxRef}>
          {messages.map((message, index) => (
            <li key={index} className={`chat ${message.type}`}>
              {message.type === 'incoming' && (
                <span className="material-symbols-outlined"></span>
              )}
              <p className={message.error ? 'error' : ''}>
                {message.content}
              </p>
            </li>
          ))}
        </ul>

        <div className="chat-input">
          <textarea
            ref={textareaRef}
            placeholder="Enter a message..."
            spellCheck="false"
            required
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <span
            id="send-btn"
            className="material-symbols-rounded"
            onClick={handleSendMessage}
            style={{ visibility: inputMessage.trim() ? 'visible' : 'hidden' }}
          >
            send
          </span>
        </div>
      </div>
    </>
  );
};

export default Chatbot;