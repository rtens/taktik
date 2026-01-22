import Coords from '../model/coords.js'
import Move from '../model/move.js'
import Place from '../model/place.js'
import Player from '../player.js'

export default class Bot extends Player {

  constructor(runner) {
    super(runner)
    this.random = Math.random
  }

  name() {
    return 'Bot'
  }

  play(game) {
    if (game.plays.length < 2) {
      const s = game.board.size - 1
      const corners = [
        new Coords(0, 0),
        new Coords(s, s),
      ]

      const empty_corner = corners.find(c =>
        game.board.square(c).empty())

      return new Place.Flat(empty_corner)
    }

    const plays = this.legal_plays(game.board, game.turn())
    return plays[Math.floor(this.random() * plays.length)]
  }

  legal_plays(board, color) {
    const plays = []

    for (const square of Object.values(board.squares)) {
      if (square.empty()) {
        if (board[color].stones.length)
          plays.push(
            new Place.Flat(square.coords),
            new Place.Wall(square.coords))

        if (board[color].capstones.length)
          plays.push(
            new Place.Cap(square.coords))

      } else if (square.top().color == color) {
        for (const dir of Object.keys(Move.directions)) {
          const max = square.pieces.length

          for (let take = 1; take <= max; take++) {
            const drops = this.spread([], take)

            for (const dropped of drops) {
              const move = new Move(square.coords).to(dir)
              for (const drop of dropped) {
                move.drop(drop)
              }

              try {
                move.apply(board.clone(), color)
                plays.push(move)
              } catch { }
            }
          }
        }
      }
    }

    return plays
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
