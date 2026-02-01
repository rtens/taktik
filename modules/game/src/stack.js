export default class Stack {

  constructor(pieces) {
    this.pieces = pieces
  }

  static of(...pieces) {
    return new Stack(pieces)
  }
}