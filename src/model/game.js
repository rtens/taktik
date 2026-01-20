import Board from './board.js'
import { Stone } from './piece.js'
import { Move, Place, PlaceFlat } from './play.js'
import { Draw, FlatWin, Forfeit, RoadWin } from './result.js'

export default class Game {

  constructor(board_size = 5) {
    this.board = new Board(board_size)
    this.plays = []
  }

  forfeit(color) {
    this.forfeited = color == 'white' ? 'black' : 'white'
  }

  result() {
    if (this.forfeited) {
      return new Forfeit(this.forfeited)
    }

    if (this.board.filled()
      || this.board.white.empty() && this.board.black.empty()
    ) {
      const { white, black } = this.flat_count()

      if (white > black) {
        return new FlatWin('white')
      } else if (black > white) {
        return new FlatWin('black')
      } else {
        return new Draw()
      }
    }

    const road = this.board.road()
    if (road) {
      return new RoadWin(road[0].top().color)
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
      if (!(play instanceof PlaceFlat)) {
        throw new Error('First two plays must place flats')
      }

      color = this.plays.length
        ? 'white'
        : 'black'
    }

    play.apply(this.board.clone(), color)

    play.apply(this.board, color)
    this.plays.push(play)
  }

  flat_count() {
    const counts = { white: 0, black: 0 }
    for (const square of Object.values(this.board.squares)) {
      const top = square.top()
      if (top instanceof Stone && !top.standing) {
        counts[top.color]++
      }
    }
    return counts
  }
}
