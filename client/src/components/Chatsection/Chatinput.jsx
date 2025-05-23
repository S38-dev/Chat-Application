import { useState } from "react";
import './Chatinput.css'
export default function Chatinput({ socket, to, onSend }) {
  const [message, setMessage] = useState("");
  
  async function SendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;

    const payload = {
      message,
      to:to.username?to.username:null,
      type: to.group_id ? "group" : "direct",
    };
   
    socket.send(JSON.stringify(payload));
     onSend(payload); 
    setMessage("");
  }

  return (
    <form onSubmit={SendMessage}>
      <input
       className="chat-input"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        id="chatbox"
      />
      <input className="send-button" type="submit" id="sendButton" />
    </form>
  );
}
