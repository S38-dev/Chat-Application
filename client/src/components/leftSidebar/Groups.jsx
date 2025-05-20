import AddGroup from "./AddGroup"

export default function Groups({groups,onSelectContact,allMessages,groupMessages,contacts}){

   const  allGroups=groups.map((g)=>
        <li key={g.group_id} onClick={(e)=>onSelectContact(g)} >
            
           
           <p>
            <b>
               {g.name}  
            </b>
           </p>

        </li>

    )
    return(
        <>
        <ul>{allGroups}</ul>
        <AddGroup contacts={contacts}/>
        </>
  
        
       
    )
}