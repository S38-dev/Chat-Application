
import { useState } from "react";
import { useEffect } from "react"

function Contacts({allMessages,contacts ,onSelectContact }) {
    
    

    const allContacts = contacts.map((c) =>
        
        <li key={c.id}  onClick={() => onSelectContact(c)}>

            <img
                src={c.profile_pic}
            />
            <p>
                <b>
                    {c.username}
                </b>
            </p>

        </li>
        

    )
    return (
        <>
            <ul>{allContacts}</ul>
            <AddContact />
        </>



    )
}