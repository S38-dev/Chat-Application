function Groups({groups}){

    allGroups=groups.map((g)=>
        <li key={g.id}>
            
           
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
        <AddGroup/>
        </>
  
        
       
    )
}