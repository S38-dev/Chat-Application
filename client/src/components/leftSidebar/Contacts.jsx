import AddContact from "./AddContact";
import "./Contacts.css";

export default function Contacts({ allMessages, contacts, onSelectContact, addingConections }) {
  const allContacts = contacts.map((c) => (
    <li key={c.id} onClick={() => onSelectContact(c)} className="contact-item">
      <img src={c.profile_pic} alt="Profile" />
      <p><b>{c.username}</b></p>
    </li>
  ));

  return (
    <div className="sidebar-section">
      <div className="list-scroll">
        <ul className="scrollable-content">{allContacts}</ul>
      </div>
      
        <AddContact  addingConections={addingConections}/>
      
    </div>
  );
}
