 import Groups  from "./Groups"
 import Contacts from "./Contacts"

 import AddgroupPage from "./AddgroupPage"
 export default function LeftSidebar({allMessages,contacts,onSelectContact ,groups,groupMessages,currentUser,addingConections}){
    
    return(
        <div className="leftSidebar">

        {/* <Notification /> */}
        
        <Contacts allMessages={allMessages} contacts={contacts}  addingConections={addingConections} onSelectContact={onSelectContact} currentUser={currentUser} />
        <Groups onSelectContact={onSelectContact} groups={groups} groupMessages={groupMessages} contacts={contacts}/>
        </div>
    )
 }