import Board from './board.js'
import Place from './place.js'
import { Forfeit } from './result.js'

export default class Game {

  constructor(size) {
    this.board = new Board(size)
    this.plays = []
  }

  perform(play) {
    if (this.plays.length < 2 && !(play instanceof Place.Flat))
      throw new Error('Must place flat')

    this.board.apply(play)
    this.plays.push(play)
  }

  forfeit() {
    this.forfeited = new Forfeit(this.board.turn)
  }

  result() {
    if (this.forfeited)
      return this.forfeited

    return this.board.game_over()
  }
}
