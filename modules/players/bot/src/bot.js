import Player from '../../../moderator/src/player.js'
import Place from '../../../game/src/place.js'
import Move from '../../../game/src/move.js'
import { Cap } from '../../../game/src/piece.js'

export default class Bot extends Player {

  constructor(mod) {
    super(mod)
    this.random = Math.random
  }

  name() {
    return 'Bot'
  }

  async play(game) {
    const legals = this.legals(game.board)
    const random = Math.floor(this.random() * legals.length)
    return legals[random]
  }

  legals(board) {
    // const key = board.fingerprint()
    // if (key in this.legal_plays_cache)
    //   return this.legal_plays_cache[key]

    if (board.game_over()) return []

    const plays = []
    for (const square of board.squares_list) {
      if (square.empty())
        place(square)
      else if (square.top().color == board.turn)
        move(square, this.drops_cache)
    }

    // this.legal_plays_cache[key] = plays
    return plays

    function place(square) {
      if (board[board.turn].stones.length)
        plays.push(
          new Place.Flat(square.coords),
          new Place.Wall(square.coords))

      if (board[board.turn].caps.length)
        plays.push(
          new Place.Cap(square.coords))
    }

    function move(square, cache = {}) {
      const height = Math.min(board.size, square.pieces.length)
      if (!(height in cache)) {
        const droppings = []
        for (let take = 1; take <= height; take++) {
          droppings.push(...spread([], take))
        }
        cache[height] = droppings
      }

      for (const dir in Move.directions) {
        const d = Move.directions[dir]

        let max = 0
        let target = square.coords.moved(d)
        while (droppable(target)) {
          max++
          target = target.moved(d)
        }

        for (const dropping of cache[height]) {
          if (dropping.length > max
            && !smashable(dropping, max, target))
            continue

          plays.push(new Move(square.coords)
            .to(dir)
            .dropping(dropping))
        }
      }

      function droppable(coords) {
        if (!(coords.name in board.squares)) return false
        const s = board.square(coords)
        const top = s.top()
        if (top instanceof Cap) return false
        if (!top || !top.standing) return true
        return false
      }

      function smashable(dropping, max, target) {
        return dropping.length == max + 1
          && square.top() instanceof Cap
          && dropping.slice(-1)[0] == 1
          && target.name in board.squares
          && board.square(target).top().standing
      }
    }

    function spread(drops, last) {
      if (!last) return [drops]

      const spreads = []
      for (let take = 0; take < last; take++) {
        spreads.push(...spread([...drops, last - take], take))
      }

      return spreads
    }
  }
}