import { useState, useEffect } from "react";
import Chatinput from "./Chatinput";
import "./Chatsection.css"

export default function ChatSection({ activeChat, allMessages, socket, groupMessages, currentUser }) {
  const [localMessages, setLocalMessages] = useState([]);
  try{
 console.log("allmessages",allMessages)
 console.log("currrentuser",currentUser)
 console.log("activeuser",activeChat.username)
  }catch(e){
    console.log(e)
  }
  useEffect(() => {
      if (activeChat) {
        if(activeChat.username){
     
      const directMsgs = allMessages.filter(msg => 
        (msg.sender_id === currentUser && msg.receiver_id === activeChat.username) ||
        (msg.sender_id === activeChat.username && msg.receiver_id === currentUser)
      );
      console.log("Filtered direct messages:", directMsgs);
      setLocalMessages(directMsgs);
       }
    
     else {
    
      const groupMsgs = groupMessages.filter(
        msg => msg.message_group === activeChat.group_id
      );
      setLocalMessages(groupMsgs);
    }
  }
  }, [activeChat, allMessages, groupMessages, currentUser]);

  const renderedMessages = localMessages.map((message) => {
    const isSender = message.sender_id === currentUser;
    return (
      <li key={message.id} 
          className={isSender ? "secondPersonMessage" : "firstPersonMessage"}>
        {message.message}
      </li>
    );
  });

  return (
    <div className="chat-section">
      <ul className="message-list">
        {activeChat ? (
          renderedMessages.length > 0 
            ? renderedMessages 
            : <li>No messages yet.</li>
        ) : (
          <li>Select a chat to start messaging</li>
        )}
      </ul>
      {activeChat && <Chatinput socket={socket} to={activeChat} currentUser={currentUser} />}
    </div>
  );
}