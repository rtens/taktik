export default class Stack {

  constructor(pieces = []) {
    this.pieces = pieces
  }

  static of(...pieces) {
    return new Stack(pieces)
  }

  drop(number) {
    return new Stack(this.pieces.splice(0, number))
  }

  add(stack) {
    this.pieces.push(...stack.pieces)
  }
}