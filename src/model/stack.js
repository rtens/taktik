export default class Stack {

  constructor(pieces) {
    this.pieces = pieces
  }

  static of(piece) {
    return new Stack([piece])
  }

  drop(number) {
    return new Stack(this.pieces.splice(0, number))
  }
}