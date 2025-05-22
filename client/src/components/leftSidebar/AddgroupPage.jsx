import { useState } from "react";
import "./AddgroupPage.css"
export default function AddgroupPage({ contacts }) {
  const [selectedArr, setSelectedArr] = useState([]);
  const [groupName, setGroupName] = useState('');

  const selectedMembers = (c) => {
    setSelectedArr((prev) => {
      if (prev.includes(c.username)) {
        return prev.filter(user => user !== c.username);
      } else {
        return [...prev, c.username];
      }
    });
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Please enter a group name ");
      return;
    }
    if (selectedArr.length === 0) {
      alert("Select at least one contact to create a group ✨");
      return;
    }
    try {
      await axios.post('/contacts/addgroup', {
        groupName: groupName,
        members: selectedArr,
      });
      alert('Group created! 🎉');
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  return (
    <>
      {(!contacts || contacts.length === 0) ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No contacts found...
        </p>
      ) : (
        <ul className="group-member-list">
          {contacts.map((c) => (
            <li 
            className="group-member-item"
              key={c.id}
              onClick={() => selectedMembers(c)}
              style={{
                backgroundColor: selectedArr.includes(c.username) ? '#e3f2fd' : 'white',
                cursor: 'pointer',
                padding: '8px',
                margin: '4px 0',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src={c.profile_pic}
                alt={`${c.username}'s profile`}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              <p><b>{c.username}</b></p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={createGroup} >
        <input
         className="group-name-input"
          type="text"
          id="groupName"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <input
        className="create-group-button"
          type="submit"
          value="Create Group"
          id="create_group_button"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        />
      </form>
    </>
  );
}
