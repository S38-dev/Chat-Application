 function LeftSidebar({allMessages,contacts,onSelectContact}){
    return(
        <div classname="leftSidebar">

        <Notification />
        <Contacts allMessages={allMessages} contacts={contacts} onSelectContact={onSelectContact} />
        <Groups/>
        </div>
    )
 }