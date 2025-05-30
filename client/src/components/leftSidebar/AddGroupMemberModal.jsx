import React, { useState } from 'react';
import './AddGroupMemberModal.css'; // We'll create this CSS file next

const AddGroupMemberModal = ({ isOpen, onClose, contacts, group, socket }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  if (!isOpen) return null;

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleAddMember = () => {
    if (selectedContact && group && socket) {
      const message = {
        type: 'add_group_member',
        groupId: group.group_id,
        username: selectedContact.username,
      };
      socket.send(JSON.stringify(message));
      console.log('Sent add_group_member message:', message);
      // TODO: Handle response from backend (success/error)
      onClose(); // Close modal after sending message
    } else {
      console.log('No contact selected or missing group/socket');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Member to {group?.group_name}</h2>
        <div className="contact-list-modal">
          {contacts && contacts.length > 0 ? (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className={`contact-item-modal${selectedContact?.username === contact.username ? ' selected' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <img src={`http://localhost:3000/uploads/${contact.profile_pic}`} alt="Profile" />
                <p>{contact.username}</p>
              </div>
            ))
          ) : (
            <p>No contacts available to add.</p>
          )}
        </div>
        <button onClick={handleAddMember} disabled={!selectedContact}>Add Member</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddGroupMemberModal; 