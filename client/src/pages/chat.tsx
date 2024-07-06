import React from "react";

const Chat = () => {
  const [contacts, _setContacts] = React.useState(["User1", "User2", "User3"]);
  const [messages, setMessages] = React.useState([
    { from: "User1", text: "Hello!" },
    { from: "User2", text: "Hi there!" },
  ]);
  const [currentMessage, setCurrentMessage] = React.useState("");

  const handleSend = () => {
    setMessages([...messages, { from: "You", text: currentMessage }]);
    setCurrentMessage("");
  };

  return (
    <div className="chat-container">
      <div className="contacts">
        <h3>Contacts</h3>
        <ul>
          {contacts.map((contact) => (
            <li key={contact}>{contact}</li>
          ))}
        </ul>
      </div>
      <div className="chat">
        <h3>Chat</h3>
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.from === "You" ? "message me" : "message"}
            >
              <strong>{message.from}: </strong>
              {message.text}
            </div>
          ))}
        </div>
        <div className="send-message">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
