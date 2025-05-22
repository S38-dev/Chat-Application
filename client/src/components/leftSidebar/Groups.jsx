import AddGroup from "./AddGroup";
import "./Contacts.css"; 

export default function Groups({ groups, onSelectContact, contacts }) {
  const allGroups = groups.map((g) => (
    <li key={g.group_id} className="group-item" onClick={() => onSelectContact(g)}>
      <p><b>{g.name}</b></p>
    </li>
  ));

  return (
    <div className="sidebar-section">
      <div className="list-scroll">
        <ul className="group-list">{allGroups}</ul>
      </div>
      <div className="bottom-action">
        <AddGroup contacts={contacts} />
      </div>
    </div>
  );
}
