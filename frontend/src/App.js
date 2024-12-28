import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:4000");

function App() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [inputName, setInputName] = useState("");
    const [users, setUsers] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("userList", (userList) => {
            setUsers(userList);
        });

        return () => socket.disconnect();
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("message", { user: username, text: message });
            setMessage("");
        }
    };

    const joinChat = () => {
        const name = inputName.trim();
        if (name) {
            socket.emit("join", name);
            setUsername(name);
        }
    };

    return (
        <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
            <div className="header">
                <button className="toggle-btn" onClick={() => setDarkMode((prev) => !prev)}>
                    Toggle {darkMode ? "Light" : "Dark"} Mode
                </button>
            </div>
            <div className="chat-layout">
                <div className="sidebar">
                    <h3>Users Online:</h3>
                    <ul className="user-list">
                        {users.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat-container">
                    {!username ? (
                        <div className="join-container">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                            />
                            <button className="join-btn" onClick={joinChat}>Submit</button>
                        </div>
                    ) : (
                        <div className="chat-section">
                            <div className="messages-container">
                                <ul className="message-list">
                                    {messages.map((msg, index) => (
                                        <li key={index} className="message-item">
                                            <strong>{msg.user}:</strong> {msg.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="message-box">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="send-btn" onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
