import AddGroup from "./AddGroup";
import "./Contacts.css";

export default function Groups({ groups = [], onSelectContact, contacts }) {
 
  const hasGroups = Array.isArray(groups) && groups.length > 0;

  return (
    <div className="sidebar-section">
      <div className="list-scroll">
        {hasGroups ? (
          <ul className="group-list">
            {groups.map((g) => (
              <li
                key={g.group_id}
                className="group-item"
                onClick={() => onSelectContact(g)}
              >
                <p><b>{g.name}</b></p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-groups-message">
            <p style={{ padding: '1rem', color: '#888', textAlign: 'center' }}>
              You haven't joined or created any groups yet.  
            </p>
          </div>
        )}
      </div>
      <div className="bottom-action">
        <AddGroup contacts={contacts} />
      </div>
    </div>
  );
}
