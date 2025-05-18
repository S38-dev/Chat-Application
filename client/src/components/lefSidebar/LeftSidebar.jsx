 function LeftSidebar({allMessages,contacts,onSelectContact ,groups}){
    return(
        <div classname="leftSidebar">

        <Notification />
        <Contacts allMessages={allMessages} contacts={contacts} onSelectContact={onSelectContact} />
        <Groups onSelectContact={onSelectContact} groups={groups} allMessages={allMessages}/>
        </div>
    )
 }