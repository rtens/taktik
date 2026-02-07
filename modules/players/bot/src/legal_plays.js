import Place from '../../../game/src/place.js'
import Move from '../../../game/src/move.js'
import { Cap } from '../../../game/src/piece.js'

const drops_cache = {}

export default class LegalPlays {

  constructor(board) {
    this.board = board
  }

  generate() {
    if (this.board.game_over()) return []

    const plays = []
    for (const square of this.board.squares_list) {
      if (square.empty())
        this.place(square, plays)
      else if (square.top().color == this.board.turn)
        this.move(square, plays)
    }

    return plays
  }

  place(square, plays) {
    if (this.board[this.board.turn].stones.length)
      plays.push(
        new Place.Flat(square.coords),
        new Place.Wall(square.coords))

    if (this.board[this.board.turn].caps.length)
      plays.push(
        new Place.Cap(square.coords))
  }

  move(square, plays) {
    const height = Math.min(this.board.size, square.pieces.length)
    if (!(height in drops_cache)) {
      const droppings = []
      for (let take = 1; take <= height; take++) {
        droppings.push(...this.spread([], take))
      }
      drops_cache[height] = droppings
    }
    const droppings = drops_cache[height]

    for (const dir in Move.directions) {
      const d = Move.directions[dir]

      let max = 0
      let target = square.coords.moved(d)
      while (this.droppable(target)) {
        max++
        target = target.moved(d)
      }

      for (const dropping of droppings) {
        if (dropping.length > max
          && !this.smashable(square, dropping, max, target))
          continue

        plays.push(new Move(square.coords)
          .to(dir)
          .dropping(dropping))
      }
    }
  }

  droppable(coords) {
    if (!(coords.name in this.board.squares)) return false
    const s = this.board.square(coords)
    const top = s.top()
    if (top instanceof Cap) return false
    if (!top || !top.standing) return true
    return false
  }

  smashable(square, dropping, max, target) {
    return dropping.length == max + 1
      && square.top() instanceof Cap
      && dropping.slice(-1)[0] == 1
      && target.name in this.board.squares
      && this.board.square(target).top().standing
  }

  spread(drops, last) {
    if (!last) return [drops]

    const spreads = []
    for (let take = 0; take < last; take++) {
      spreads.push(...this.spread([...drops, last - take], take))
    }

    return spreads
  }
}
