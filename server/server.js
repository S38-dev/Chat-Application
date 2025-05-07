const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const expressWs = require('express-ws');
expressWs(app);
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});


//......................................WebSocket routes..............................................

const clients = new Map();
let clientId;
app.ws("/ws", (ws, req) => {
    console.log("ws connection has been established")
    clientId = req.user.userId

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



            receiver.ws.send(JSON.stringify(payload))
        }
        else{
            
            clients.forEach((metadata,id)=>{
                if(metadata.groups.includes(message.group)){
                    const payload={
                        message:message,
                        form: req.user.userId,
                        reciever:id,
                        group: parsedMessage.group,

                    }
                    metadata.ws.send(JSON.stringify(payload));
                }
            })
        }










    })

    ws.on("close", () => {
        console.log("close", clientId);
        clients.clear(clientId);

    })
    ws.on('error', (err) => {
        console.log('WebSocket error:', err);
    });







})