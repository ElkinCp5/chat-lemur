import React from "react";
import "./chat.css";

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

  return <div className="container app"></div>;
};

export default Chat;
