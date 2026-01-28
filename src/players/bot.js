import Coords from '../model/coords.js'
import Move from '../model/move.js'
import Place from '../model/place.js'
import { Win } from '../model/result.js'
import Player from '../player.js'

export default class Bot extends Player {

  constructor(runner, level, think_time) {
    super(runner)
    this.level = level ? parseInt(level) : 2
    this.think_time_ms = think_time
      ? parseInt(think_time)
      : Math.pow(2, this.level) * 200
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
    if (game.plays.length < 2)
      return this.opening_play(game)

    return this.best_play(game.board)
  }

  opening_play(game) {
    const s = game.board.size - 1
    const corners = [
      new Coords(0, 0),
      new Coords(s, s),
    ]

    const empty_corner = corners.find(c => game.board.square(c).empty())

    return new Place.Flat(empty_corner).commented('opening')
  }

  best_play(board) {
    const start = new Date().getTime()
    const timeout = start + this.think_time_ms
    const sorted = this.legal_plays(board)
    const info = { searched: 0 }

    let chosen = null
    let depth = 0
    try {
      for (; depth <= this.level; depth++) {
        const plays = this.best_plays(board, depth, sorted, timeout, info)
        chosen = plays[Math.floor(this.random() * plays.length)]
        sorted.sort((a, b) => {
          if (plays.indexOf(a) > -1) return -1
          if (plays.indexOf(b) > -1) return 1
          return 0
        })
      }
    } catch (e) {
      if (e != 'TIME') throw e
      chosen.comment += ` timeout@${depth}`
    }

    chosen.comment += ` ${Math.round(info.searched / (new Date().getTime() - start + 1) * 1000)}/s`
    return chosen
  }

  best_plays(board, depth, sorted, timeout, info) {
    let plays = []

    let best = -Infinity
    for (const play of sorted || this.legal_plays(board)) {
      const score = -this.search(
        board.applied(play),
        depth,
        best,
        Infinity,
        timeout,
        info)

      play.comment = `${score}@${depth}`

      if (score == best) plays.push(play)
      if (score > best) {
        best = score
        plays = [play]
      }
    }

    return plays
  }

  search(board, depth, alpha, beta, timeout, info) {
    if (info) info.searched++

    if (timeout && new Date().getTime() > timeout)
      throw 'TIME'

    const game_over = board.game_over()
    if (game_over instanceof Win)
      return game_over.color == board.turn
        ? 9000 + depth
        : -9000 - depth

    if (!depth) return this.evaluate(board)

    for (const play of this.legal_plays(board)) {
      const score = -this.search(
        board.applied(play),
        depth - 1,
        -beta,
        -alpha,
        timeout,
        info)

      if (this.pruning && score >= beta) return beta
      if (score > alpha) alpha = score
    }
    return alpha
  }

  evaluate(board) {
    const { white, black } = board.flat_count()
    const flat_diff = (white - black)

    const stash_diff = board.black.count() - board.white.count()

    const chains = board.chains(board.turn)
      .filter(c => c.length > 1)
      .reduce((sum, c) => sum + c.length, 0)

    const evaluation = stash_diff
      + flat_diff * 10
      + chains * 10

    return board.turn == 'white'
      ? evaluation
      : -evaluation
  }

  legal_plays(board) {
    if (board.legal_plays_cache)
      return board.legal_plays_cache

    if (board.game_over()) return []

    const plays = []
    for (const square of Object.values(board.squares)) {
      if (square.empty()) {
        place(square)

      } else if (square.top().color == board.turn) {
        for (const dir of Object.keys(Move.directions)) {
          move(square, dir)
        }
      }
    }

    board.legal_plays_cache = plays
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

    function move(square, dir) {
      const max = square.pieces.length
      for (let take = 1; take <= max; take++) {
        for (const dropped of spread([], take)) {
          const move = new Move(square.coords)
            .to(dir)
            .dropping(dropped)

          try {
            board.applied(move)
            plays.push(move)
          } catch { }
        }
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
