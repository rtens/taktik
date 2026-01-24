import Coords from '../model/coords.js'
import Move from '../model/move.js'
import Place from '../model/place.js'
import Player from '../player.js'

export default class Bot extends Player {

  constructor(runner, level) {
    super(runner)
    this.level = level ? parseInt(level) : 2
    this.think_time_ms = (this.level + 1) * 100
    this.random = Math.random
    this.pruning = true
    this.debug = []
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
    const debug = {}
    this.debug.push(debug)

    debug.evals ||= {}
    debug.chosen ||= {}
    const start = new Date().getTime()

    let chosen = null

    try {
      for (let depth = 0; depth <= this.level; depth++) {
        debug.evals[depth] = []

        let best = -Infinity
        let plays = []
        for (const play of this.legal_plays(board, color)) {

          const clone = board.clone()
          play.apply(clone, color)

          const side = color == 'white' ? 1 : -1
          const deep_eval = side * this.deep_evaluate(clone, best, side * -1, depth, start, debug)

          debug.evals[depth].push([play.ptn(), deep_eval])

          if (deep_eval == best) plays.push(play)
          if (deep_eval <= best) continue

          plays = [play]
          best = deep_eval
        }

        // console.log(plays.map(p => p.ptn()))

        chosen = plays[Math.floor(this.random() * plays.length)]
        debug.chosen[depth] = chosen.ptn()
      }
    } catch { }

    return chosen
  }

  deep_evaluate(board, bestest, side, depth, start, debug) {
    debug.searched ||= {}
    debug.searched[depth] ||= 0
    debug.searched[depth]++

    const evaluation = this.evaluate(board)
    if (!depth) return evaluation

    if (Math.abs(evaluation) > 900)
      return evaluation + side * depth

    const passed = new Date().getTime() - start
    if (passed > this.think_time_ms) throw 'TIME_OUT'

    const color = side == 1 ? 'white' : 'black'
    let best = -Infinity
    for (const play of this.legal_plays(board, color)) {
      const clone = board.clone()
      play.apply(clone, color)

      const deep_eval = side * this.deep_evaluate(clone, bestest, side * -1, depth - 1, start, debug)
      // console.log(depth, color, play.ptn(), deep_eval, bestest)

      if (this.pruning && deep_eval < bestest) return -deep_eval
      if (deep_eval > best) best = deep_eval
    }

    return best
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

    if (board.finished()
      || board.road('white')
      || board.road('black')) return []

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
