import Coords from './coords.js'

export default class Play {

  constructor(coords) {
    this.coords = coords
    this.comment = ''
  }

  static at(file, rank) {
    return new this(new Coords(file, rank))
  }

  // commented(comment) {
  //   this.comment = comment
  //   return this
  // }

  apply(_board) {
    throw new Error('not implemented')
  }

  revert(_board) {
    throw new Error('not implemented')
  }

  // ptn() {
  //   throw new Error('not implemented')
  // }
}