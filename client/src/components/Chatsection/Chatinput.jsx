import { json } from "express";

function Chatinput({socket,to}){
const [message, setMessage] = useState("");
async function SendMessage(event){

    event.preventDefault();
     if (!message.trim()) return; 
  
   socket.send(JSON.stringify({ message, to }))
     
    



}
    return(
       <form action="post" id="chatform" onSubmit={(event)=>{SendMessage(event)}}>
        <input type="text" id="chatbox" onChange={(e)=>{setMessage(e.target.value)}}/>
         <input type="submit" id="sendButton" />
        </form> 
    )
}