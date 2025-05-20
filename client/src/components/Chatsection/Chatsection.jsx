import { useRef } from "react";
import Chatinput from "./Chatinput"
export default function Chatsection({ activeChat, allMessages, socket, groupMessages }) {
   const receiver =useRef('')
   const Allmessages=useRef('');
   const messagelist=useRef('')
   const [messageList,setmessageList]=useState('')
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
 setmessageList(messageList.current)
  return (
    <div className="chatbody">
      <ul>{messagelist}</ul>

      <Chatinput to={messageList} socket={socket} />
    </div>
  );
}
