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
    clients.set(clientId, ws);

    ws.on("message", async (message) => {


        console.log("message comming from front end <form>:", message)
        //await addMessage(message);
        const user = clientId
        const receiverId = message.to;
        const receiver = clients.get(receiverId)
        const payload = {
            message: message,
            form: user,
            to: receiver,


        }
        


        ws.send(JSON.stringify(payload))


        



    })

    ws.on("close",()=>{
        console.log("close",clientId);
        clients.clear(clientId);

    })
    






})