
const socket = io.connect("localhost:3977");
var player, game;
//import chessgame from '../../server.js'

init = () => {
  const p1Color = "white";
  const p2Color = "black";

  setInterval(() => {
    socket.emit("rooms");
  }, 3000);

  $(".rooms").on("click", (e) => {
    const room = e.target.innerText;

    player = new Player(p2Color);
    socket.emit("join", { room: room });
  });

  $("#new").on("click", () => {
    player = new Player(p1Color);
    socket.emit("create");
  });

  $("#return").on("click", function () {
    const room = $(this).text().slice(12, 16);

    socket.emit("end", { room: room });
    location.reload();
  });

  socket.on("listGame", (data) => {
    $(".rooms").empty();

    data.list.forEach((e) => {
      $(".rooms").append(`<h5>${e}</h5>`);
    });
  });

  socket.on("newGame", (data) => {
    const message = "Game ID: " + data.room;

    game = new Game(data.room);
    game.displayBoard(message);
  });

  socket.on("playerOne", () => {
    player.setTurn(false);
  });

  socket.on("playerTwo", (data) => {
    const message = "Partida ID: " + data.room;

    game = new Game(data.room);
    game.displayBoard(message);
    player.setTurn(true);
  });

  socket.on("turnPlayed", (data) => {
    let row = game.getRow(data.tile);
    let col = game.getCol(data.tile);
    console.log(data.chess);
 
    const opponentColor = player.getColor() === p1Color ? p2Color : p1Color;
    game.updateBoard(opponentColor, row, col, data.tile);
    player.setTurn(true);
    
  });

  /**
   * 
   * Este socket recibe el historial de partida, si lo necesitas cambiar de lugar hacia game. hacelo
   */
  socket.on("history", (data) => {
    console.log(data)
  })

  socket.on("endGame", (data) => {
    game.endGameMessage(data.message);
  });

  socket.on("movementIlegal", (data) => {
    alert("Movimiento no permitido: " + data.from + " to ", data.to);
  });

  socket.on("err", (data) => {
    alert(data.message);
    location.reload();
  });

  socket.on("userDisconnect", () => {
    game.disconnected();
  });
};

socket.on("history", (data) => {
  console.log(data)
})

init();
