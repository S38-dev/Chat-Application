// AddContact.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AddContact.css";

export default function AddContact({ addingConections, Login, socket }) {
  const [isFormVisible, setFormVisible] = useState(false);
  const [username, setUsername] = useState('');
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // WebSocket handler
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'contacts_updated') {
          console.log("Updated contacts received:", msg.contacts);
          addingConections(msg.contacts);
        }
      } catch (e) {
        console.error("Error parsing socket message", e);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket, addingConections]);

  // Form visibility toggle
  const toggleForm = () => setFormVisible(prev => !prev);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target) &&
          !buttonRef.current.contains(event.target)) {
        setFormVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Add contact handler
  const addContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/contacts/addcontact",
        { username: username },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Contact added successfully!");
        setUsername("");
        setFormVisible(false);
      }
    } catch (error) {
      // Error handling remains the same as original
      if (error.response) {
        const { status } = error.response;
        const messages = {
          404: "User not found. Please check the username and try again.",
          401: "You are not authorized. Please login again.",
          500: "Server error. Please try again later."
        };
        alert(messages[status] || `Error: ${error.response.data?.error}`);
      } else {
        alert(`Network error: ${error.message}`);
      }
    }
  };

  return (
    <>
      <div className="add-contact-button" ref={buttonRef} onClick={toggleForm}>
        Add Contacts
      </div>
      <form
        className="add-contact-form"
        ref={formRef}
        style={{ display: isFormVisible ? 'block' : 'none' }}
        onSubmit={addContact}
      >
        <input
          className="add-contact-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button type="submit" className="add-contact-submit">
          Add
        </button>
      </form>
    </>
  );
}