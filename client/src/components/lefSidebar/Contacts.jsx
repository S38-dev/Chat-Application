function Contacts({contacts}){

    allContacts=contacts.map((c)=>
        <li key={c.id}>
            
           <img 
             src={c.img}
           />
           <p>
            <b>
               {c.name}  
            </b>
           </p>

        </li>

    )
    return(
        <>
        <ul>{allContacts}</ul>
        <AddContact/>
        </>
  
        
       
    )
}