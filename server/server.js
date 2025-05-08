const express = require('express');
const app = express();
// const { v4: uuidv4 } = require('uuid');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const expressWs = require('express-ws');
expressWs(app);
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});




//......................................WebSocket .............................................

const clients = new Map();

app.ws("/ws", (ws, req) => {
    
    console.log("ws connection has been established")
   let clientId = req.user.userId

    clients.set(clientId, { ws, groups: [] });

    ws.on("message", async (msg) => {
        const message=JSON.parse(msg)

        if (!message.group) {
            console.log("message comming from front end <form>:", message)
            //await addMessage(message);
            const user = req.user.userId
            const receiverId = message.to;
            const receiver = clients.get(receiverId)
            const payload = {
                message: message,
                form: user,
                to:receiverId,
                group:null,


            }


            if (message.type === "fetch") {
                const from = req.user.userId;
                const messages = await getAllMessagesForSender(from);
                ws.send(JSON.stringify({
                  type: "fetched_messages",
                  messages
                }));
              }



            receiver.ws.send(JSON.stringify(payload))
        }


        if (message.type === "joinGroup") {
            const client = clients.get(clientId);
            if (client && !client.groups.includes(message.groupId)) {
                client.groups.push(message.groupId);
            }
            return;
        }



        else{
            
            clients.forEach((metadata,id)=>{
                if(metadata.groups.includes(message.group)){
                    const payload={
                        message:message,
                        form: req.user.userId,
                        reciever:id,
                        group: message.group,

                    }
                    metadata.ws.send(JSON.stringify(payload));
                }
            })
        }










    })

    ws.on("close", () => {
        console.log("close", clientId);
        clients.delete(clientId);

    })
    ws.on('error', (err) => {
        console.log('WebSocket error:', err);
    });







})



