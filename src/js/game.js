
var timer;
var clicks = 0;
var posicionAnterior = " ";
var posicionSiguiente = " " ;
var colAnterior = 0;
var rowAnterior = 0;
var colSiguiente = 0;
var rowSiguiente = 0;

const theme = {
  light: '#EFF3F4',
  dark: '#0F3547',
}

const pieceTheme = {
  light: '#FFFFFF',
  dark: '#000000',
}
// 	♔,♕,♖,♗,♘,♙
const pieces = {
  king: ['♚', '♔'],
  queen: ['♛', '♕'],
  rook: ['♜', '♖'],
  bishop: ['♝', '♗'],
  knight: ['♞', '♘'],
  pawn: ['&#9823', '&#9817'],
}

class Game {

  constructor(room) {
    this.room = room;
    this.board = [];
    this.moves = 0;

  }

  createGameBoard() {

    function clickHandler(e) {
      let row, col;
      row = game.getRow(e.target.id);
      col = game.getCol(e.target.id);

      //resetee posiciones
      if(posicionAnterior!== " " && posicionSiguiente !==" "){
        posicionSiguiente = " ";
        posicionAnterior = " ";
      }
      console.log(player.getColor());
      //comprueba que no se este seleccione una casilla sin pieza
      if ($(`#${row}_${col}`).html().length !== 0 || clicks > 0) {

        if (clicks == 1 && posicionSiguiente == " " ) {
          
          if ($(`#${row}_${col}`).html().length !== 0) {
            game.clearFirstPosition(posicionAnterior);
            clicks = 0;
            return;
          }
        }

        if (!player.getTurn() || !game) {
          return;
        }

        $(".table").removeAttr("style");

       
        game.updateBoard('#D24379', row, col, e.target.id);
     
        clicks++;

        if (clicks == 1) {
          colAnterior = col;
          rowAnterior = row;
          posicionAnterior = row + "_" + col;
  
        } if (clicks == 2) {
          posicionSiguiente = row + "_" + col;
          colSiguiente = col;
          rowSiguiente = row;
        }

        if (clicks == 2  ) {
          
          $(`#${posicionSiguiente}`).html($(`#${posicionAnterior}`).html());
          $(`#${posicionAnterior}`).html(``);
          game.clearBoard(posicionAnterior, posicionSiguiente);
          game.playTurn(e.target);

          player.setTurn(false);
   
          clicks = 0;
        } else {
          player.setTurn(true);
        }
      }
      

    }

    game.createTiles(clickHandler);

    if (player.getColor() != "white" && this.moves == 0) {
      game.setTimer();
    } else {
      $(".table").prop("disabled", true);
    }

  }

  createTiles(clickHandler) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i + j) % 2 == 0) {
          $(".table").append(`<button class="tile" id="${i}_${j}" "style="background-color:${theme.light}, font-size: 300px;"></button> `);
        } else {
          $(".table").append(`<button class="tile" id="${i}_${j}" style="background-color:${theme.dark} ;"></button>`);
        }
      }
      if ((i) % 2 == 0) {
        $(".table").append(
          `<button class="tile" id="${i}_7" style="float:none;background-color:${theme.dark} ;"></button>`
        );
      } else {
        $(".table").append(
          `<button class="tile" id="${i}_7" style="float:none;background-color:${theme.light} ;"></button>`
        );
      }
    }

    game.placePieces();

    for (let i = 0; i < 8; i++) {
      this.board.push([""]);
      for (let j = 0; j < 8; j++) {
        $(`#${i}_${j}`).on("click", clickHandler);
      }
    }
  }


  placePieces() {
    for (let i = 0; i < 8; i += 1) {
      $(`#${1}_${i}`).html(`${pieces.pawn[0]}`)
      $(`#${6}_${i}`).html(`${pieces.pawn[1]}`)

      for (let i = 0; i < 8; i += 1) {
        $(`#${i * 7}_${0}`).html(`${i ? pieces.rook[1] : pieces.rook[0]}`);
        $(`#${i * 7}_${7}`).html(`${i ? pieces.rook[1] : pieces.rook[0]}`);

        $(`#${i * 7}_${1}`).html(`${i ? pieces.bishop[1] : pieces.bishop[0]}`);
        $(`#${i * 7}_${6}`).html(`${i ? pieces.bishop[1] : pieces.bishop[0]}`);

        $(`#${i * 7}_${2}`).html(`${i ? pieces.knight[1] : pieces.knight[0]}`);
        $(`#${i * 7}_${5}`).html(`${i ? pieces.knight[1] : pieces.knight[0]}`);

        $(`#${i * 7}_${3}`).html(`${i ? pieces.queen[1] : pieces.queen[0]}`);

        $(`#${i * 7}_${4}`).html(`${i ? pieces.king[1] : pieces.king[0]}`);

      }
    }

  }

  setTimer() {
    timer = setInterval(() => {
      var time = player.getTime();
      --player.time;

      if (player.getTime() == -9999999999999999999) {
        let message;

        message = player.getColor() == "white" ? "black" : "white";

        socket.emit("end", {
          room: game.getRoom(),
          message: message,
        });

        game.endGameMessage(message);
        clearInterval(timer);
      }
    }, 1000);
  }


  displayBoard(message) {
    $(".room").css("display", "none");
    $("header").addClass("order");
    $("#return").css("display", "block");
    $("#logo").css("display", "none");
    $(".game").css("display", "block");
    $("#roomID").html(message);
    this.createGameBoard();
  }

  updateBoard(color, row, col, tile) {
    clearInterval(timer);
    $(".table").prop("disabled", true);
    if (!player.getTurn()) {
      game.setTimer();
      // $(".table").prop("disabled", false);
    }
    $(`#${tile}`)
      .css("backgroundColor", `${color}`)
    //.prop("disabled", true);
    this.board[row][col] = color[0];
    this.moves++;
  }

  getClicks(){
    return clicks;
  }
  getRow(id) {
    let row = id.split("_")[0];
    return row;
  }

  getCol(id) {
    let col = id.split("_")[1];
    return col;
  }

  getRoom() {
    return this.room;
  }

  getPosicionAnterior(){
    return posicionAnterior;
  }

  getColAnterior(){
    return colAnterior;
  }

  getRowAnterior(){
    return rowAnterior;
  }

  getColSiguiente(){
    return colSiguiente;
  }

  getRowSiguiente(){
    return rowSiguiente;
  }

  getPosicionSiguiente(){
    return posicionSiguiente;
  }

  playTurn(tile) {
    const clickedTile = $(tile).attr("id");
    const previusTile = game.getPosicionAnterior();
    const letter = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const number = [8, 7, 6, 5, 4, 3, 2, 1]
    const myArr = clickedTile.split("");
    const move = letter[myArr[2]] + number[myArr[0]];
    console.log("move: " + move);
    socket.emit("turn", {

      previus: [game.getRowAnterior(),game.getColAnterior()],
      next: [game.getRowSiguiente(),game.getColSiguiente()],
      tile: clickedTile,
      previusTile: previusTile,
      room: this.getRoom(),
      move: move
    });
  }

  endGameMessage(message) {
    clearInterval(timer);
    $(".tile").attr("disabled", true);

    if (message == player.color) {
      message = "ganaste";
      printMessage();
    } else if (message.includes("desconectado")) {
      $("#turn").text(message);
    } else if (message.includes("Empate")) {
      message = "empate";
      printMessage();
    } else {
      message = "perdiste";
      printMessage();
    }

    function printMessage() {
      const value = message.split("");
      $("#turn").css("opacity", 0);

      value.forEach((e) => {
        $("#result").append(`<h1>${e}</h1>`);
      });
      $("#result").css("display", "flex");
    }
  }

  /*   horizontal(color) {
      let value;
      for (let row = 0; row < 8; row++) {
        value = 0;
        for (let col = 0; col < 8; col++) {
          if (game.board[row][col] != color) {
            value = 0;
          } else {
            value++;
          }
          if (value == 5) {
            this.winner();
            return;
          }
        }
      }
    } */

  /*   vertical(color) {
      let value;
      for (let col = 0; col < 8; col++) {
        value = 0;
        for (let row = 0; row < 8; row++) {
          if (game.board[row][col] != color) {
            value = 0;
          } else {
            value++;
          }
          if (value == 5) {
            this.winner();
            return;
          }
        }
      }
    } */

  /* 
    diagonal(color) {
      for (let col = 0; col < 8; col++) {
        if (col > 4) {
          for (let row = 0; row < 8; row++) {
            let match = true;
            for (let i = 0; i < 5; i++) {
              if (color != game.board[row + i][col - i]) match = false;
            }
  
            if (match) {
              this.winner();
              return;
            }
          }
        }
      }
    }
   */
  /*  diagonalReverse(color) {
     for (let col = 0; col < 8; col++) {
       for (let row = 0; row < 8; row++) {
         let match = true;
         for (let i = 0; i < 5; i++) {
           if (color != game.board[row + i][col + i]) match = false;
         }
         if (match) {
           this.winner();
           return;
         }
       }
     }
   } */

  /*  checkWinner() {
     let color = player.getColor()[0];
 
     this.horizontal(color);
     this.vertical(color);
     this.diagonal(color);
     this.diagonalReverse(color);
 
     if (this.checkDraw()) {
       const message = "¡Empate!";
 
       socket.emit("end", {
         room: this.getRoom(),
         message: message,
       });
       this.endGameMessage(message);
     }
   } */

  checkDraw() {
    return this.moves >= 8 * 8;
  }

  disconnected() {
    const message = "Jugador desconectado";

    socket.emit("end", {
      room: this.getRoom(),
      message: message,
    });
    this.endGameMessage(message);
  }

  winner() {
    const message = player.getColor();

    socket.emit("end", {
      room: this.getRoom(),
      message: message,
    });
    this.endGameMessage(message);
  }


  clearBoard(p1 , p2) {
    //console.log("entra");
   // console.log(posicionAnterior, posicionSiguiente);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 7; j++) {

       if (`${i}_${j}` != p1 && `${i}_${j}` != p2) {
          if ((i + j) % 2 == 0) {
            
            $(`#${i}_${j}`).css("background-color",`${theme.light}`)
          } else {
            $(`#${i}_${j}`).css("background-color",`${theme.dark}`)
          }
        }

      }

      if (`${i}_7` != p1 || `${i}_7` != p2) {
        if ((i) % 2 == 0) {
          $(`#${i}_7`).css("background-color", `${theme.dark}`)
        } else {
          $(`#${i}_7`).css("background-color", `${theme.light}`)
        }
      }
      
    }
  }

  clearFirstPosition(p1) {
    //console.log("entra");
   // console.log(posicionAnterior, posicionSiguiente);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 7; j++) {

       if (`${i}_${j}` == p1 ) {
          if ((i + j) % 2 == 0) {
            
            $(`#${i}_${j}`).css("background-color",`${theme.light}`)
          } else {
            $(`#${i}_${j}`).css("background-color",`${theme.dark}`)
          }
        }

      }

      if (`${i}_7` == p1 ) {
        if ((i) % 2 == 0) {
          $(`#${i}_7`).css("background-color", `${theme.dark}`)
        } else {
          $(`#${i}_7`).css("background-color", `${theme.light}`)
        }
      }
      
    }
  }

}
