import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AddContact.css";

export default function AddContact({addingConections,Login,socket}) {
    const [isFormVisible, setFormVisible] = useState(false);
    const [username, setUsername] = useState('');
    const formRef = useRef(null);
    const buttonRef = useRef(null);
   

    const toggleForm = () => {
        setFormVisible(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (
            formRef.current &&
            !formRef.current.contains(event.target) &&
            !buttonRef.current.contains(event.target)
        ) {
            setFormVisible(false);
        }
    };



// useEffect(() => {
//   let timerId;

//   const fetchContacts = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/contacts/contacts", {
//         withCredentials: true
//       });
//       console.log("Fetching contacts...", res.data.contacts);
//       addingConections(res.data.contacts)
//     } catch (e) {
//       console.error("Error fetching contacts", e);
//     } finally {
//       timerId = setTimeout(fetchContacts, 2000); 
//     }
//   };

//   fetchContacts(); 

//   return () => clearTimeout(timerId);
// }, [Login]);



    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
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
    
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);



    const addContact = async (e) => {
        e.preventDefault();
     

        try {
            const response = await axios.post("http://localhost:3000/contacts/addcontact", { username: username }, { withCredentials: true });
            console.log("Contact added!", response.data);
            if (response.status === 200) {
                console.log('200')
                // socket.addEventListener('message', (event) => {
                //     console.log("Raw message from server:", event.data); 
                //     try {
                //         const msg = JSON.parse(event.data);
                //         console.log("mesg is commitng ",msg)
                //         if (msg.type === 'add-contact') {
                //             console.log("msg contacts",msg.contacts)
                //             addingConections(msg.contacts);
                //         }
                //     } catch (e) {
                //         console.error("Error parsing socket message", e);
                //     }
                // });
                alert("Contact added successfully!");
                setUsername("");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    alert(" User not found. Please check the username and try again.");
                } else if (error.response.status === 401) {
                    alert(" You are not authorized. Please login again.");
                } else if (error.response.status === 500) {
                    alert(" Server error. Please try again later.");
                } else {
                    alert(`Unexpected error: ${error.response.data?.error || error.message}`);
                }
            } else {
                alert(` Network or unexpected error: ${error.message}`);
            }
            console.error("Error adding contact:", error);
        }
    }


    return (
        <>
            <div
                className="add-contact-button"
                ref={buttonRef}
                onClick={toggleForm}
            >
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
                />
                <input
                    type="submit"
                    value="Add"
                    className="add-contact-submit"
                   
                />
            </form>
        </>
    );
}
