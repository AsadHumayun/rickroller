import Express from "express";
import HTTP from "http";
import { join } from "node:path";
import { Server } from "socket.io";

const app = Express();
const server = HTTP.createServer(app);
const io = new Server(server);

const sockets = [];
const RICKROLLER = `<script>window.location.replace("https://www.youtube.com/watch?v=iik25wqIuFo")</script>`;

app.get("/", (req, res) => {
    res.sendFile(join(process.cwd(), "Main.html"));
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
            connected: sockets.length,
        });
});

io.on("connection", (socket) => {
    sockets.push(socket);
    console.log(`[${Date.now()}] New connection established.`);
});

server.listen(3000, () => {
    console.log("Server started, port #3000");
});