import Board from './board.js'

export default class Game {

  constructor(size) {
    this.board = new Board(size)
  }
}