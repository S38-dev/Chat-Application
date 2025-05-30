import { useEffect, useState } from "react";
import AddGroup from "./AddGroup";
import "./Groups.css";
import AddGroupMemberModal from "./AddGroupMemberModal";

export default function Groups({ groups = [], onSelectContact, contacts, socket, setGroups, activeChat }) {
  const hasGroups = Array.isArray(groups) && groups.length > 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupForMember, setSelectedGroupForMember] = useState(null);

  const handleAddMemberClick = (group) => {
    setSelectedGroupForMember(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroupForMember(null);
  };

  return (
    <div className="groups-section">
      <div className="groups-list-scroll">
        {hasGroups ? (
          <ul className="groups-list">
            {groups.map((g) => (
              <li
                key={g.group_id}
                className={`group-item${activeChat && activeChat.group_id === g.group_id ? ' selected' : ''}`}
                onClick={() => onSelectContact(g)}
              >
                <div className="group-icon">
                  {g.group_name.charAt(0).toUpperCase()}
                </div>
                <p className="group-name"><b>{g.group_name}</b></p>
                <div className="add-member-icon" onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the group when clicking the icon
                  handleAddMemberClick(g);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus-circle">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
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
      {isModalOpen && (
        <AddGroupMemberModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          contacts={contacts}
          group={selectedGroupForMember}
          socket={socket}
        />
      )}
    </div>
  );
}
