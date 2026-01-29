import Coords from './coords.js'
import { Stone } from './piece.js'
import Stack from './stack.js'

export default class Square {

  constructor(coords) {
    this.coords = coords
    this.pieces = []
  }

  static at(file, rank) {
    return new Square(new Coords(file, rank))
  }

  empty() {
    return this.pieces.length == 0
  }

  top() {
    if (this.empty()) return null
    return this.pieces.slice(-1)[0]
  }

  stack(stack) {
    this.pieces
      .filter(p => p instanceof Stone)
      .forEach(p => p.flat())
    this.pieces.push(...stack.pieces)
  }

  take(number) {
    if (number > this.pieces.length) {
      throw new Error(`Can only take ${this.pieces.length}`)
    }

    return new Stack(this.pieces.splice(-number, number))
  }

  clone() {
    const square = new Square(this.coords)
    square.pieces = this.pieces.map(p => p.clone())
    return square
  }
}
