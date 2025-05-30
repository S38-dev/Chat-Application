import AddContact from "./AddContact";
import "./Contacts.css";

export default function Contacts({ allMessages, socket, contacts, onSelectContact, addingConections, Login = { Login }, activeChat }) {
  const allContacts = contacts.map((c) => (
    <li
      key={c.id}
      onClick={() => onSelectContact(c)}
      className={`contact-item${activeChat && activeChat.username === c.username ? ' selected' : ''}`}
    >
      <img src={`http://localhost:3000/uploads/${c.profile_pic}`} alt="Profile" />
      <p><b>{c.username}</b></p>
    </li>
  ));

  return (
    <div className="sidebar-section">
      <div className="list-scroll">
        <ul className="scrollable-content">{allContacts}</ul>
      </div>
      <AddContact Login={Login} socket={socket} addingConections={addingConections} />
    </div>
  );
}
