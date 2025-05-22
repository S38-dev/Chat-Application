import { useState } from "react";
import Chatinput from "./Chatinput";
import "./Chatsection.css"
export default function ChatSection({ activeChat, allMessages, socket, groupMessages }) {
  const [messageList, setMessageList] = useState([]);

  let renderedMessages = [];

  if (activeChat?.group_id) {
    const groupMsgs = groupMessages.filter(
      (msg) => msg.message_group === activeChat.group_id
    );

    renderedMessages = groupMsgs.map((message) => {
      const isSender = message.sender_id === activeChat.username;
      return (
        <li key={message.id} className={isSender ? "secondPersonMessage" : "firstPersonMessage"}>
          {message.content}
        </li>
      );
    });
  }

  return (
    <div className="chat-section">
      <ul className="message-list">
        {renderedMessages.length > 0 ? renderedMessages : <li>No messages yet.</li>}
      </ul>
      <Chatinput socket={socket} activeChat={activeChat} />
    </div>
  );
}
