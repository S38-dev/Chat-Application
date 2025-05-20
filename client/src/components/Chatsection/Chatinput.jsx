import { useState } from "react";

export default function Chatinput({ socket, to }) {
  const [message, setMessage] = useState("");

  async function SendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;

    const payload = {
      message,
      to,
      type: to.group_id ? "group" : "direct",
    };

    socket.send(JSON.stringify(payload));
    setMessage(""); // clear input
  }

  return (
    <form onSubmit={SendMessage}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        id="chatbox"
      />
      <input type="submit" id="sendButton" />
    </form>
  );
}
