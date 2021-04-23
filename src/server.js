const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 4000;

const staticPath = path.join(__dirname, "static");
app.use(express.static(staticPath));
app.set("views", path.join(staticPath));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
    res.render("index.html");
})

let turn = 'X';
let board = [];

for (let i = 0; i < 9; i++) board[i] = " ";

let connectedPlayers = [];

io.on("connection", socket => {
    handleConnect(socket);

    socket.on("disconnect", () => 
        handleDisconnect(socket)
    )

    socket.on("tileClick", (data) => 
        handleTileClick(socket, data)
    )

    socket.on("gameReset", () => {
        resetBoard(socket);
    })
})

const handleConnect = (socket) => {
    console.log(`Socket conectado ${socket.id}`)

    const playerObject = {
        id: socket.id,
        value: getPlayerValue(),
    }

    socket.emit("playerObject", playerObject);
    updateGame();

    connectedPlayers.push(playerObject);
    logPlayers()
}

const updateGame = () => {
    io.emit("gameUpdate", board);
}

const resetBoard = (socket) => {
    for (let i = 0; i < 9; i++) board[i] = " ";
    updateGame(socket);
}

const findPlayerIndex = (id) => {
    return connectedPlayers.findIndex((el) => el.id == id);
}

const findPlayerObject = (id) => {
    const playerIndex = findPlayerIndex(id);
    if (playerIndex == -1) return undefined;
    return connectedPlayers[playerIndex];
}

const handleDisconnect = (socket) => {
    const id = socket.id;
    console.log(`Socket desconectado ${id}`)
    const playerIndex = findPlayerIndex(id);

    playerIndex != 1 && connectedPlayers.splice(playerIndex, 1);

    logPlayers();
}

const logPlayers = () => {
    console.log(`Jogadores conectados: ${connectedPlayers.length}\n`);
}

const handleTileClick = (socket, data) => {
    const playerObject = findPlayerObject(socket.id);
    const value = playerObject.value;
    board[data.tilePos] = value;
    updateGame(socket);
}

const getPlayerValue = () => {
    if (connectedPlayers.length == 0) return "X";

    if (connectedPlayers.length == 1) return "O";

    return "INVALID";
}

server.listen(PORT);
