 import Groups  from "./Groups"
 import Contacts from "./Contacts"

 import AddgroupPage from "./AddgroupPage"
 export default function LeftSidebar({onCreated,allMessages,socket,setGroups,contacts,onSelectContact ,Login,groups,groupMessages,currentUser,addingConections}){
    
    return(
        <div className="leftSidebar">

        {/* <Notification /> */}
        
        <Contacts allMessages={allMessages} contacts={contacts} socket={socket} addingConections={addingConections} Login={Login} onSelectContact={onSelectContact} currentUser={currentUser} />
        <Groups onCreated={onCreated}onSelectContact={onSelectContact}  setGroups={setGroups} groups={groups} socket={socket} groupMessages={groupMessages} contacts={contacts}/>
        </div>
    )
 }