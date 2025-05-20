export default function AddGroup({ contacts }) {
  const [selectedArr, setSelectedArr] = useState([]);
  const [groupName, setGroupName] = useState('');

  const selectedMembers = (c) => {
    setSelectedArr((prev) => [...prev, c.username]);
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/contacts/addgroup', {
        groupName: groupName,
        members: selectedArr,
      });
      alert('Group created!');
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  return (
    <>
      <ul>
        {contacts.map((c) => (
          <li key={c.id} onClick={() => selectedMembers(c)}>
            <img src={c.profile_pic} alt="" />
            <p><b>{c.username}</b></p>
          </li>
        ))}
      </ul>
      <form onSubmit={createGroup}>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input type="submit" value="Create Group" id="create_group_button" />
      </form>
    </>
  );
}
