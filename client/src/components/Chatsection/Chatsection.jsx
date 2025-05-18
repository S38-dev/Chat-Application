function Chatsection({ activeChat, allMessages, socket }) {
  const Allmessages = allMessages.filter((message) =>
    message.sender_id === activeChat.username || message.receiver_id === activeChat.username
  );

  const messagelist = Allmessages.map((message) => {
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

  return (
    <div className="chatbody">
      <ul>{messagelist}</ul>
      <Chatinput to={activeChat.username} socket={socket} />
    </div>
  );
}
