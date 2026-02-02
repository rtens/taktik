import Stash from './stash.js'
import Square from './square.js'

export default class Board {

  constructor(size) {
    this.size = size
    this.turn = 'white'
    this.white = new Stash('white', size)
    this.black = new Stash('black', size)
    this.init_squares()
  }

  init_squares() {
    this.squares = {}

    for (let file = 0; file < this.size; file++) {
      for (let rank = 0; rank < this.size; rank++) {
        const square = Square.at(file, rank)
        this.squares[square.coords.name] = square
      }
    }
  }

  square(coords) {
    const square = this.squares[coords.name]
    if (!square) throw new Error(`Not a square: ${coords.name}`)
    return square
  }

  apply(play) {
    play.apply(this)
    this.next()
  }

  revert(play) {
    this.next()
    play.revert(this)
  }

  next() {
    if (this.turn == 'white')
      this.turn = 'black'
    else
      this.turn = 'white'
  }
}