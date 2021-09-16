class Player {
  constructor(color) {
    this.color = color;
    this.turn = false;
    this.time = 300;
  }

  getColor() {
    return this.color;
  }

  getTime() {
    return this.time;
  }

  getTurn() {
    return this.currentTurn;
  }

  setTurn(turn) {
    this.currentTurn = turn;

    if (turn) {
      $("#turn").text("Es tu turno");
    } else {
      $("#turn")
        .text("Espera a tu oponente")
        .append(`<div class="dot-typing"></div>`);
    }
  }
}
