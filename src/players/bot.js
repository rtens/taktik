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
    const debug = {
      searched: {},
      evals: {},
      chosen: {}
    }
    this.debug.push(debug)

    const start = new Date().getTime()

    let chosen = null

    try {
      for (let depth = 0; depth <= this.level; depth++) {
        debug.evals[depth] = []
        debug.searched[depth] = {}
        const searched = debug.searched[depth]

        let best = -Infinity
        let plays = []
        for (const play of this.legal_plays(board, color)) {
          const applied = board.clone()
          play.apply(applied, color)

          const score = color == 'white'
            ? this.minimax(true, applied, best, start, searched, depth)
            : -this.minimax(false, applied, best, start, searched, depth)

          debug.evals[depth].push([play.ptn(), score])

          if (score == best) plays.push(play)
          if (score > best) {
            plays = [play]
            best = score
          }
        }

        chosen = plays[Math.floor(this.random() * plays.length)]
        debug.chosen[depth] = chosen.ptn()
      }
    } catch (e) {
      if (e != 'TIME_OUT') throw e
    }

    return chosen
  }

  minimax(min, board, sofar, start, searched, depth) {
    searched[depth] ||= 0
    searched[depth]++

    const evaluation = this.evaluate(board)
    if (!depth) return evaluation

    if (Math.abs(evaluation) > 900)
      return evaluation + depth

    const passed = new Date().getTime() - start
    if (passed > this.think_time_ms) throw 'TIME_OUT'

    const color = min ? 'black' : 'white'
    let best = min ? Infinity : -Infinity
    for (const play of this.legal_plays(board, color)) {
      const applied = board.clone()
      play.apply(applied, color)

      const score = this.minimax(!min, applied, sofar, start, searched, depth - 1)

      if (this.pruning && score < sofar) return score

      if (min && score < best) best = score
      if (!min && score > best) best = score
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
