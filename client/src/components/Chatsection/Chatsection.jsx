import { useRef } from "react";

function Chatsection({ activeChat, allMessages, socket, groupMessages }) {
   const receiver =useRef('')
   const Allmessages=useRef('');
   const messagelist=useRef('')
  if (activeChat.group_id) {

    Allmessages.current = groupMessages.filter((message) =>
      message.message_group == activeChat.group_id
    )
    messagelist.current= Allmessages.current.map((message) => {
      if (message.sender_id == activeChat.username) {
        return (
          <li key={message.id} className="2ndPersonMessage">
            {message.content}
          </li>
        )

      }
      else {
        return (
          <li key={message.id} className="1stPersonMessage">
            {message.content}
          </li>
        );
      }
    })



  }













else{
  Allmessages.current = allMessages.filter((message) =>
    message.sender_id === activeChat.username || message.receiver_id === activeChat.username
  );

  messagelist.current = Allmessages.current.map((message) => {

    if (message.receiver_id === activeChat.username) {
      return (
        <li key={message.id} className="1stPersonMessage">
          {message.content}
        </li>
      );
    } else {
      return (
        <li key={message.id} className="2ndPersonMessage">
          {message.content}
        </li>
      );
    }
  });
}
 receiver.current =activeChat.group_id?activeChat:activeChat.username
  return (
    <div className="chatbody">
      <ul>{messagelist}</ul>

      <Chatinput to={receiver.current} socket={socket} />
    </div>
  );
}
