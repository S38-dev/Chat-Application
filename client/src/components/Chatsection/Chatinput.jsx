import { useState } from "react";
import './Chatinput.css'
export default function Chatinput({ socket, to, onSend,currentUser }) {
  const [message, setMessage] = useState("");
  


  
  async function SendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;
    const payload = {
      message,
       sender_id: currentUser,  
      receiver_id:to.username?to.username:null,
       message_group: to.group_id || null,
      type: to.group_id ? "group" : "direct",
      timestamp: new Date().toISOString()


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
      <button className="send-button" type="submit" id="sendButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-send">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}
