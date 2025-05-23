import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AddContact.css";

export default function AddContact({addingConections}) {
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

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const addContact = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post("http://localhost:3000/contacts/addcontact", { username: username }, { withCredentials: true });
            console.log("Contact added!", response.data);
            if (response.status === 200) {
                try{
                await axios.get("http://localhost:3000/contacts/contacts",{ withCredentials: true }).then((res)=>{
                   console.log("fetching contacts to send as connections ",res)
                    addingConections(res)
                })}
                catch(e){
                    console.log("error in fetchigng contacts",e)
                }
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
