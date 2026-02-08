import Board from './board.js'
import Place from './place.js'
import { Forfeit } from './result.js'

export default class Game {

  constructor(size, white, black) {
    this.board = new Board(size)
    this.white = white
    this.black = black
    this.plays = []
    this.started = new Date().toISOString()
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

  clone() {
    const clone = new Game(this.board.size)
    clone.board = this.board.clone()
    clone.white = this.white
    clone.black = this.black
    clone.plays = [...this.plays]
    clone.started = this.started
    return clone
  }

  ptn() {
    const turns = []
    for (let p = 0; p < this.plays.length; p += 2) {
      const white = this.plays[p]
      const black = this.plays[p + 1]

      const parts = [turns.length + 1 + '.']
      parts.push(white.ptn())
      if (black) parts.push(black.ptn())

      const comments = []
      if (white.comment) comments.push(white.comment)
      if (black && black.comment) comments.push(black.comment)
      if (comments.length) parts.push(`{${comments.join('; ')}}`)
      turns.push(parts.join(' '))
    }

    return [
      '[Site "taktik"]',
      '[Event "Local Play"]',
      `[Date "${this.started.slice(0, 10).replaceAll('-', '.')}"]`,
      `[Time "${this.started.slice(11, 19)}"]`,
      `[Player1 "${this.white}"]`,
      `[Player2 "${this.black}"]`,
      '[Clock "none"]',
      `[Result "${this.result().ptn()}"]`,
      `[Size "${this.board.size}"]`,
      '',
      ...turns,
      this.result().ptn()
    ].join('\n')
  }
}
