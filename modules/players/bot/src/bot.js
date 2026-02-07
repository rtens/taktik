import Player from '../../../moderator/src/player.js'
import Place from '../../../game/src/place.js'
import Coords from '../../../game/src/coords.js'
import LegalPlays from './legal_plays.js'
import { Win } from '../../../game/src/result.js'

const GAME_OVER = 900
const INFINITY = 9999

export default class Bot extends Player {

  constructor(mod, level) {
    super(mod)
    this.random = Math.random
    this.level = level ? parseInt(level) : 2
    this.reset_cache()
  }

  reset_cache() {
    this.evaluation_cache = {}
    this.legal_plays_cache = {}
  }

  name() {
    return 'Bot' + this.level
  }

  async play(game) {
    if (game.plays.length < 2)
      return this.opening(game.board)

    return this.best(game.board)
  }

  legals(board) {
    const key = board.fingerprint()
    if (key in this.legal_plays_cache)
      return this.legal_plays_cache[key]

    this.legal_plays_cache[key] = new LegalPlays(board).generate()
    return this.legal_plays_cache[key]
  }

  opening(board) {
    const s = board.size - 1
    const corners = [
      new Coords(0, 0),
      new Coords(s, s),
    ]

    const empty_corner = corners.find(c => board.square(c).empty())

    return new Place.Flat(empty_corner)
  }

  best(board) {
    this.reset_cache()

    const plays = this.best_plays(board, this.level)
    return plays[Math.floor(this.random() * plays.length)]
  }

  best_plays(board, depth) {
    let plays = []
    let best = -INFINITY

    for (const play of this.legals(board)) {
      board.apply(play)
      const score = -this.search(board, depth, best, INFINITY)
      board.revert(play)

      if (score == best) {
        plays.push(play)

      } else if (score > best) {
        best = score
        plays = [play]
      }
    }

    return plays
  }

  search(board, depth, alpha, beta) {
    const game_over = board.game_over()
    if (game_over instanceof Win)
      return game_over.color == board.turn
        ? GAME_OVER
        : -GAME_OVER

    if (!depth) return this.evaluate(board)

    for (const play of this.legals(board)) {
      board.apply(play)
      const score = -this.search(board, depth - 1, -beta, -alpha)
      board.revert(play)

      if (score >= beta) return beta
      if (score > alpha) alpha = score
    }

    return alpha
  }

  evaluate(board) {
    const key = board.fingerprint()
    if (key in this.evaluation_cache)
      return this.evaluation_cache[key]

    const { white, black } = board.flat_count()
    const flat_diff = white - black

    const chain_diff = this.chains(board, 'white')
      - this.chains(board, 'black')

    const evaluation = 0
      + flat_diff * 10
      + chain_diff * 10

    this.evaluation_cache[key] = board.turn == 'white'
      ? evaluation
      : -evaluation
    return this.evaluation_cache[key]
  }

  chains(board, color) {
    return board.chains(color)
      .filter(c => c.length > 1)
      .reduce((sum, c) => sum + c.length, 0)
  }
}
