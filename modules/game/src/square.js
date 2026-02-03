import Coords from './coords.js'
import Stack from './stack.js'

export default class Square {

  constructor(coords) {
    this.coords = coords
    this.pieces = []
  }

  static at(file, rank) {
    return new Square(new Coords(file, rank))
  }

  with(...pieces) {
    this.pieces = pieces
    return this
  }

  empty() {
    return this.pieces.length == 0
  }

  top() {
    return this.pieces.slice(-1)[0]
  }

  stack(stack) {
    this.pieces.forEach(p => p.flat())
    this.pieces.push(...stack.pieces)
  }

  take(number) {
    if (number > this.pieces.length)
      throw new Error('Over stack size')

    return new Stack(this.pieces.splice(-number, number))
  }
}
