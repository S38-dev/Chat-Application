import { useState } from "react";
import './Chatinput.css'
export default function Chatinput({ socket, to, onSend,currentUser }) {
  const [message, setMessage] = useState("");
  
  async function SendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;
    console.log("receiver id",to.username)
    console.log("senderid",currentUser)
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
      <input className="send-button" type="submit" id="sendButton" />
    </form>
  );
}
