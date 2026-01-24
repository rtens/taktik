import Board from './board.js'
import Place from './place.js'
import { Draw, FlatWin, Forfeit, RoadWin } from './result.js'

export default class Game {

  constructor(board_size = 5, white = null, black = null) {
    this.board = new Board(board_size)
    this.white = white ? white.name() : 'Unknown'
    this.black = black ? black.name() : 'Unknown'
    this.started = new Date().toISOString()
    this.plays = []
  }

  forfeit(color) {
    this.forfeited = color == 'white' ? 'black' : 'white'
  }

  result() {
    if (this.forfeited) {
      return new Forfeit(this.forfeited)
    }

    if (this.board.road('white')) {
      return new RoadWin('white')
    }
    if (this.board.road('black')) {
      return new RoadWin('black')
    }

    if (this.board.finished()) {
      const { white, black } = this.board.flat_count()

      if (white > black) {
        return new FlatWin('white')
      } else if (black > white) {
        return new FlatWin('black')
      } else {
        return new Draw()
      }
    }
  }

  turn() {
    return this.plays.length % 2 == 0
      ? 'white'
      : 'black'
  }

  perform(play) {
    let color = this.turn()

    if (this.plays.length < 2) {
      if (!(play instanceof Place.Flat)) {
        throw new Error('First two plays must place flats')
      }

      color = this.plays.length
        ? 'white'
        : 'black'
    }

    const clone = this.board.clone()
    play.apply(clone, color)
    this.board = clone
    this.plays.push(play)
  }

  clone() {
    const game = new Game()
    game.board = this.board.clone()
    game.plays = [...this.plays]
    return game
  }

  ptn() {
    const turns = []
    for (let p = 0; p < this.plays.length; p += 2) {
      const parts = [turns.length + 1 + '.']
      parts.push(this.plays[p].ptn())
      if (this.plays[p + 1]) parts.push(this.plays[p + 1].ptn())
      turns.push(parts.join(' '))
    }

    return [
      '[Site "takbot"]',
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
