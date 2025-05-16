function Chatsection(messages, selectedContactGroups,socket) {
    const Allmessages = messages.filter((message) => {
        if (message.message_group == selectedContactGroups) {
            return message
        }
        if (message.sender_id == selectedContactGroups || message.receiver_id == selectedContactGroups) {
            return message
        }
    })
    const messagelist = Allmessages.map((message) => (
        <li key={message.id}>{message.content}</li>
    ));

    return (
        <chatBody classname="chatbody">
        <ul>
            {messagelist}
        </ul>
        <Chatinput to={selectedContactGroups} socket={socket}/>
        </chatBody>
    );
      
    
    


}