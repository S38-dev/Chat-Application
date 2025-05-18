import { useState } from "react";
import axios from "axios";

function AddContact() {
    const [styleDisplay, setStyleDisplay] = useState('none');
    const [username, setUsername] = useState('');

    const showForm = () => {
        setStyleDisplay('block');
    };

    const addContact = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("newContact", username);

        try {
            const response = await axios.post("/contact/addcontact", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Contact added!", response.data);
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    return (
        <>
            <div className="AddContact-button" onClick={showForm}>
                Add Contacts
            </div>
            <form
                id="addContactForm"
                style={{ display: styleDisplay }}
                onSubmit={addContact}
            >
                <input
                    type="text"
                    id="addUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input type="submit" id="addContact" value="Add" />
            </form>
        </>
    );
}
