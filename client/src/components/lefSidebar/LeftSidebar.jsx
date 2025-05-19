 function LeftSidebar({allMessages,contacts,onSelectContact ,groups,groupMessages}){
    return(
        <div className="leftSidebar">

        <Notification />
        <Contacts allMessages={allMessages} contacts={contacts} onSelectContact={onSelectContact} />
        <Groups onSelectContact={onSelectContact} groups={groups} groupMessages={groupMessages}/>
        </div>
    )
 }