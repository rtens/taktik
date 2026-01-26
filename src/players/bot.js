import Coords from '../model/coords.js'
import Move from '../model/move.js'
import Place from '../model/place.js'
import { Win } from '../model/result.js'
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

    return this.best_play(game.board)
  }

  best_play(board) {
    const timeout = new Date().getTime() + this.think_time_ms

    let chosen = null
    for (let depth = 0; depth <= this.level; depth++) {
      try {
        const plays = this.best_plays(board, depth, timeout)
        chosen = plays[Math.floor(this.random() * plays.length)]
      } catch (e) {
        if (e != 'TIME') throw e
      }
    }
    return chosen
  }

  best_plays(board, depth, timeout) {
    let plays = []

    let best = -Infinity
    for (const play of this.legal_plays(board)) {
      const score = -this.search(
        board.applied(play),
        depth,
        best,
        Infinity,
        timeout)

      if (score == best) plays.push(play)
      if (score > best) {
        best = score
        plays = [play]
      }
    }

    return plays
  }

  search(board, depth, alpha, beta, timeout) {
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
        timeout)

      if (this.pruning && score >= beta) return beta
      if (score > alpha) alpha = score
    }
    return alpha
  }

  evaluate(board) {
    const { white, black } = board.flat_count()
    const evaluation = (white - black) * 10
      + board.black.count()
      - board.white.count()

    return board.turn == 'white'
      ? evaluation
      : -evaluation
  }

  legal_plays(board) {
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

    return plays

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

    function place(square) {
      if (board[board.turn].stones.length)
        plays.push(
          new Place.Flat(square.coords),
          new Place.Wall(square.coords))

      if (board[board.turn].caps.length)
        plays.push(
          new Place.Cap(square.coords))
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