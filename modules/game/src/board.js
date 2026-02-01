import Stash from './stash.js'

export default class Board {

  constructor(size) {
    this.turn = 'white'
    this.white = new Stash('white', size)
    this.black = new Stash('black', size)
  }
}