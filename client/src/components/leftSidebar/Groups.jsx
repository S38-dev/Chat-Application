import { useEffect } from "react";
import AddGroup from "./AddGroup";
import "./Contacts.css";

export default function Groups({ groups = [],onCreated, onSelectContact, contacts, socket,setGroups }) {
  

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("groupsss",data)
        if (data.type === "update-group") {
          console.log("🎉 New group received via WebSocket:", data);

        const newGroup = {
        group_id: data.groupId,
        group_name: data.groupName
      };
      onCreated(newGroup)
        }
      } catch (err) {
        console.error("🧨 WebSocket message parse error:", err);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, setGroups]);
  console.log("groups aray",groups)
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
                <p><b>{g.group_name}</b></p>
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
