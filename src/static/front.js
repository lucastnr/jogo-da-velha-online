// heroku
// "https://server-jogo-da-velha.herokuapp.com/";
// local
// "localhost:5251";

class Hash {
    #tiles;
    socket;
    #player = "INVALID";
    #modal;

    constructor() {
        this.#tiles = document.body.getElementsByClassName("tile");
        this.#modal = document.getElementById("modal");
        const reset = document.getElementById("reset");

        this.socket = io("https://server-jogo-da-velha.herokuapp.com/");

        this.socket.on("gameUpdate", data => this.handleGameChange(data, this.socket))
        this.socket.on("playerObject", data => this.handlePlayerObject(data))

        reset.onclick = () => this.handleReset(this.socket);
    }

    handleGameChange(data, socket) {
        console.log(data);
        for (let i = 0; i < 9; i++) {
            this.#tiles[i].innerHTML = data[i];
            this.#tiles[i].onclick = e => this.handleTileClick(e, socket)
        }

        this.#modal.className = "invisible"
    }

    handlePlayerObject(data) {
        this.#player = data;
    }

    handleTileClick(e, socket) {
        if (this.#player.value == "INVALID") return;

        const tile = e.target;
        const tilePos = tile.className.split(" ")[1];

        if (tile.innerHTML != ' ') return;

        this.#tiles[tilePos].innerHTML = this.#player.value;

        socket.emit("tileClick", {
            tilePos,
            value: this.#player,
        })
    }

    handleReset(socket) {
        socket.emit("gameReset");
    }
}

const _game = new Hash();