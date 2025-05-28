import { useEffect } from "react";
import AddGroup from "./AddGroup";
import "./Groups.css";

export default function Groups({ groups = [],onCreated, onSelectContact, contacts, socket,setGroups }) {
  

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("groupsss",data)
        if (data.type === "update-group") {
          console.log(" New group received via WebSocket:", data);

        const newGroup = {
        group_id: data.group.groupId,
        group_name: data.groupName
      };
      onCreated(newGroup)
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
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
    <div className="groups-section">
      <div className="groups-list-scroll">
        {hasGroups ? (
          <ul className="groups-list">
            {groups.map((g) => (
              <li
                key={g.group_id}
                className="group-item"
                onClick={() => onSelectContact(g)}
              >
                <div className="group-icon">
                  {g.group_name.charAt(0).toUpperCase()}
                </div>
                <p className="group-name"><b>{g.group_name}</b></p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-groups-message">
            <p>
              You haven't joined or created any groups yet.
            </p>
          </div>
        )}
      </div>
      <div className="groups-bottom-action">
        <AddGroup contacts={contacts} />
      </div>
    </div>
  );
}
