import Express from "express";
import HTTP from "http";

import { Server } from "socket.io";

const app = Express();
const server = HTTP.createServer(app);
const io = new Server(server);

let connected = 0;
const sockets = [];

const RICKROLLER = `<script>window.location.replace("https://www.youtube.com/watch?v=iik25wqIuFo")</script>`;

app.get("/", (req, res) => {
    res.send(
        `
<!DOCTYPE html>
<body>
    <p><i>Loading website contents.... this may take a while</i></p>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io();
        socket.on("rickroll", () => {
            console.log("Received rickroll event from WS server.")
            window.location.replace("https://www.youtube.com/watch?v=iik25wqIuFo");
        })
    </script>
</body>
        `
    );
});

app.get("/backdoor/exec/:auth", async (req, res) => {
    console.log(`[${Date.now()}] Received request on '/backdoor/exec/', commencing authorisation.`);
    if (req.params.auth != process.env.auth) return res.send(RICKROLLER);
    console.log(`[${Date.now()}] Authorisation successful.`);
    sockets.forEach((socket) => {
        console.log(`[${Date.now()}] Emitting socket wss:${socket.id}`);
        socket.emit("rickroll");
    });

    return res
        .status(200)
        .json({
            connected,
        });
});

io.on("connection", (socket) => {
    sockets.push(socket);
    console.log(`[${Date.now()}] New connection established.`);
    connected++;
});

server.listen(3000, () => {
    console.log("Server started, port #3000");
});