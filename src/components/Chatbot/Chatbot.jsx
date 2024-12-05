/**
 * @module Chatbot
 */

import React, { useState } from "react";
import { apiURL } from '../../config.js'
import "./Chatbot.css"; // Optional: Create a CSS file for chatbot styling

/**
 * A functional component that serves as a chatbot interface.
 *
 * @function Chatbot
 * @returns {JSX.Element} The rendered chatbot component.
 */
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  /**
   * Handles sending a message to the chatbot backend.
   * Formats the user's query by appending " from Panda Express" before sending.
   * Updates the chat UI with both user input and bot responses.
   *
   * @async
   * @function handleSend
   */
  
  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user's input to the messages array (shown as-is)
    const newMessages = [...messages, { text: userInput, sender: "user" }];
    setMessages(newMessages);

    // Append " from Panda Express" to the query sent to the backend
    const formattedQuery = `${userInput} from Panda Express`;

    try {
      const response = await fetch(`${apiURL}/api/chatbot/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: formattedQuery }), // Send formatted query
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
    }

    // Clear input field
    setUserInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message ${
              msg.sender === "user" ? "chatbot-user" : "chatbot-bot"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

