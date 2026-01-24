import Coords from '../model/coords.js'
import Move from '../model/move.js'
import Place from '../model/place.js'
import Player from '../player.js'

export default class Bot extends Player {

  constructor(runner, level) {
    super(runner)
    this.level = level ? parseInt(level) : 2
    this.random = Math.random
  }

  at(level) {
    this.level = level
    return this
  }

  name() {
    return 'Bot@' + this.level
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

    return this.best_play(game.board, game.turn())
  }

  best_play(board, color) {
    const depth = this.level

    const evals = this.legal_plays(board, color)
      .map(play => ({
        play,
        evaluation: this.evaluate_play(board.clone(), play, color, depth)
      }))

    // console.log(color, evals.map(e => e.play.ptn() + ' ' + e.evaluation))

    const best = color == 'white'
      ? Math.max(...evals.map(e => e.evaluation))
      : Math.min(...evals.map(e => e.evaluation))

    const best_plays = evals
      .filter(e => e.evaluation == best)
      .map(e => e.play)

    return best_plays[Math.floor(this.random() * best_plays.length)]
  }

  evaluate_play(board, play, color, depth = 0) {
    play.apply(board, color)
    const evaluation = this.evaluate(board)

    if (!depth) return evaluation

    if (Math.abs(evaluation) > 900)
      return evaluation + (color == 'white' ? depth : -depth)

    const next = color == 'white' ? 'black' : 'white'

    const evals = this.legal_plays(board, next)
      .map(play => this.evaluate_play(board.clone(), play, next, depth - 1))

    return next == 'white'
      ? Math.max(...evals)
      : Math.min(...evals)
  }

  evaluate(board) {
    if (board.road('white')) return 9000
    if (board.road('black')) return -9000

    let evaluation = board.black.count() - board.white.count()

    const { white, black } = board.flat_count()
    evaluation += (white - black) * 10

    if (board.finished())
      return (white - black) * 1000

    return evaluation
  }

  legal_plays(board, color) {
    const plays = []

    for (const square of Object.values(board.squares)) {
      if (square.empty()) {
        if (board[color].stones.length)
          plays.push(
            new Place.Flat(square.coords),
            new Place.Wall(square.coords))

        if (board[color].caps.length)
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
