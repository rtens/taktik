import Coords from '../model/coords.js'
import Move from '../model/move.js'
import Place from '../model/place.js'
import { Win } from '../model/result.js'
import Player from '../player.js'
import { Cap } from '../model/piece.js'

const TIMEOUT = 'TIMEOUT'
const GAME_OVER = 9000

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
    this.drops_cache = {}
    this.reset_cache()
  }

  reset_cache() {
    this.evaluation_cache = {}
    this.legal_plays_cache = {}
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
    this.reset_cache()

    const start = new Date().getTime()
    const timeout = start + this.think_time_ms
    const sorted = this.legal_plays(board)
    const info = { searched: 0, tree: {} }
    this.debug.push(info)

    let chosen = null
    let depth = 0
    for (; depth <= this.level; depth++) {
      const branch = info.tree[depth] = []

      const plays = this.best_plays(
        board,
        depth,
        sorted,
        timeout,
        info,
        branch)

      if (!plays.length) break

      chosen = plays[Math.floor(this.random() * plays.length)]
      sorted.sort((a, b) => {
        if (plays.indexOf(a) > -1) return -1
        if (plays.indexOf(b) > -1) return 1
        return 0
      })
    }

    this.add_comment(start, info, chosen)

    return chosen
  }

  add_comment(start, info, chosen) {
    const time = new Date().getTime() - start
    const searches = Math.round(info.searched / (time + 1) * 1000)
    chosen.comment += ` ${time}ms ${searches}/s`
    if (time > this.think_time_ms) chosen.comment += ' TIMEOUT'
  }

  best_plays(board, depth, sorted, timeout, info, root) {
    let plays = []

    let best = -Infinity
    for (const play of sorted || this.legal_plays(board)) {
      const branch = []

      board.apply(play)
      const searched = this.search(
        board,
        depth,
        best,
        Infinity,
        timeout,
        info,
        branch)
      board.revert(play)

      if (searched == TIMEOUT) break
      const score = -searched

      if (root) root.push({ play: play.ptn(), score, branch })
      play.comment = `${score}@${depth}`

      if (score == best) plays.push(play)
      if (score > best) {
        best = score
        plays = [play]
      }
    }

    return plays
  }

  search(board, depth, alpha, beta, timeout, info, root) {
    if (info) info.searched++

    const evaluation = this.evaluate(board)

    if (!depth)
      return evaluation
    if (evaluation >= GAME_OVER)
      return evaluation + depth * 100
    if (evaluation <= -GAME_OVER)
      return evaluation - depth * 100

    if (timeout && new Date().getTime() > timeout)
      return TIMEOUT

    for (const play of this.legal_plays(board)) {
      const branch = []

      board.apply(play)
      const searched = this.search(
        board,
        depth - 1,
        -beta,
        -alpha,
        timeout,
        info,
        branch)
      board.revert(play)

      if (searched == TIMEOUT) return TIMEOUT
      const score = -searched

      if (root) root.push({ play: play.ptn(), score, branch })
      if (this.pruning && score >= beta) return beta
      if (score > alpha) alpha = score
    }

    return alpha
  }

  evaluate(board) {
    const key = board.fingerprint()
    if (key in this.evaluation_cache)
      return this.evaluation_cache[key]

    let over = 0
    const game_over = board.game_over()
    if (game_over instanceof Win) 
      over = game_over.color == 'white'
        ? GAME_OVER
        : -GAME_OVER

    const stash_diff = board.black.count()
      - board.white.count()

    const { white, black } = board.flat_count()
    const flat_diff = white - black

    const chain_diff = this.chains(board, 'white')
      - this.chains(board, 'black')

    const evaluation = 0
      + stash_diff * 10
      + flat_diff * 10
      + chain_diff * 10
      + over

    let relative = board.turn == 'white'
      ? evaluation
      : -evaluation

    if (!over && this.tak(board))
      relative -= 1000

    this.evaluation_cache[key] = relative
    return relative
  }

  chains(board, color) {
    return board.chains(color)
      .filter(c => c.length > (c == board.turn ? 2 : 1))
      .reduce((sum, c) => sum + c.length, 0)
  }

  tak(board) {
    let road = false

    board.next()
    const turn = board.turn
    for (const play of this.legal_plays(board)) {
      board.apply(play)
      road = !!board.road(turn)
      board.revert(play)
      if (road) break
    }
    board.next()

    return road
  }

  legal_plays(board) {
    const key = board.fingerprint()
    if (key in this.legal_plays_cache)
      return this.legal_plays_cache[key]

    if (board.game_over()) return []

    const plays = []
    for (const square of board.squares_list) {
      if (square.empty())
        place(square)
      else if (square.top().color == board.turn)
        move(square, this.drops_cache)
    }

    this.legal_plays_cache[key] = plays
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

    function move(square, cache) {
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
