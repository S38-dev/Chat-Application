 import Groups  from "./Groups"
 import Contacts from "./Contacts"

 import AddgroupPage from "./AddgroupPage"
 export default function LeftSidebar({allMessages,contacts,onSelectContact ,groups,groupMessages}){
    
    return(
        <div className="leftSidebar">

        {/* <Notification /> */}
        
        <Contacts allMessages={allMessages} contacts={contacts} onSelectContact={onSelectContact} />
        <Groups onSelectContact={onSelectContact} groups={groups} groupMessages={groupMessages} contacts={contacts}/>
        </div>
    )
 }