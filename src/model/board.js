import Coords from './coords.js'
import Move from './move.js'
import Square from './square.js'
import Stash from './stash.js'
import { Cap, Stone } from '../model/piece.js'
import { Draw, FlatWin, RoadWin } from './result.js'

const pieces = {
  3: [10, 0],
  4: [15, 0],
  5: [21, 1],
  6: [30, 1],
  7: [40, 2],
  8: [50, 2]
}

export default class Board {

  constructor(size) {
    this.size = size
    this.turn = 'white'
    this.white = new Stash().starting('white', ...pieces[size])
    this.black = new Stash().starting('black', ...pieces[size])
    this.init_squares()
    this.create_neighbors()
    this.reset_cache()
  }

  init_squares() {
    this.squares = {}
    this.squares_list = []

    for (let file = 0; file < this.size; file++) {
      for (let rank = 0; rank < this.size; rank++) {
        const square = new Square(new Coords(file, rank))
        this.squares[square.coords.name] = square
        this.squares_list.push(square)
      }
    }
  }

  create_neighbors() {
    this.neighbors = {}
    for (const [c, s] of Object.entries(this.squares))
      this.neighbors[c] = Object.values(Move.directions)
        .map(dir => s.coords.moved(dir).name)
        .filter(n => n in this.squares)
  }

  reset_cache() {
    this.chain_cache = {}
    this.fingerprint_cache = null
    this.game_over_cache = undefined
  }

  next() {
    if (this.turn == 'white')
      this.turn = 'black'
    else
      this.turn = 'white'
  }

  square(coords) {
    const square = this.squares[coords.name]
    if (!square) throw new Error(`Not a square: ${coords.name}`)
    return square
  }

  apply(play) {
    play.apply(this)
    this.next()
    this.reset_cache()
  }

  revert(play) {
    this.next()
    play.revert(this)
    this.reset_cache()
  }

  game_over() {
    if (this.game_over_cache !== undefined)
      return this.game_over_cache

    let go = null

    if (this.road('white')) {
      go = new RoadWin('white')

    } else if (this.road('black')) {
      go = new RoadWin('black')

    } else if (this.finished()) {
      const { white, black } = this.flat_count()

      if (white > black) {
        go = new FlatWin('white')
      } else if (black > white) {
        go = new FlatWin('black')
      } else {
        go = new Draw()
      }
    }

    this.game_over_cache = go
    return go
  }

  finished() {
    return this.full()
      || !this.white.count()
      || !this.black.count()
  }

  full() {
    return !this.squares_list.find(s => s.empty())
  }

  flat_count() {
    const counts = { white: 0, black: 0 }
    for (const square of this.squares_list) {
      const top = square.top()
      if (top instanceof Stone && !top.standing) {
        counts[top.color]++
      }
    }
    return counts
  }

  road(color) {
    return this.chains(color)
      .filter(chain => chain.length >= this.size)
      .find(chain => {
        const files = chain.map(s => s.coords.file)
        const ranks = chain.map(s => s.coords.rank)
        return Math.min(...files) == 0 && Math.max(...files) == this.size - 1
          || Math.min(...ranks) == 0 && Math.max(...ranks) == this.size - 1
      })
  }

  chains(color) {
    const checked = {}

    if (!this.chain_cache[color])
      this.chain_cache[color] = this.squares_list
        .map(square => this.build_chain(square, color, checked))
        .filter(chain => chain.length)

    return this.chain_cache[color]
  }

  build_chain(square, color, checked) {
    const c = square.coords.name

    if (c in checked)
      return []

    checked[c] = true

    const top = square.top()
    if (square.empty() || top.standing || top.color != color)
      return []

    const chain = [square]
    for (const n of this.neighbors[c])
      chain.push(...this.build_chain(this.squares[n], color, checked))

    return chain
  }

  clone() {
    const board = new Board(this.size)
    board.turn = this.turn
    board.white = this.white.clone()
    board.black = this.black.clone()
    board.squares = Object.entries(this.squares)
      .reduce((acc, [c, s]) => ({ ...acc, [c]: s.clone() }), {})
    board.squares_list = Object.values(board.squares)

    return board
  }

  fingerprint() {
    if (!this.fingerprint_cache)
      this.fingerprint_cache = this.turn + this.squares_list
        .map(s => s.pieces
          .map(p => this.symbol(p)).join(''))
        .join('|')

    return this.fingerprint_cache
  }

  print(paint = null) {
    paint ||= { white: s => s, black: s => s }
    const stacks = this.sort_stacks()

    const rows = []
    for (let r = this.size - 1; r >= 0; r--) {
      const max = Math.max(1, ...stacks[r].map(s => s.length))

      for (let l = max - 1; l >= 0; l--) {
        const row = []
        for (const stack of stacks[r]) {
          const piece = stack[l]
          const p = piece
            ? paint[piece.color](this.symbol(piece))
            : ' '

          row.push(' ' + p + ' ')
        }
        rows.push((r + 1) + ' |' + row.join('|') + '|')
      }
      rows.push('  |' + this.repeat('---').join('+') + '|')
    }

    const files = [...Array(this.size).keys()]
      .map(i => ' ' + String.fromCharCode(97 + i) + ' ').join(' ')

    const output = [
      '  ,' + this.repeat('---').join('-') + ',',
      ...rows.slice(0, -1),
      "  '" + this.repeat('---').join('-') + "'",
      '   ' + files
    ].join('\n').split('\n')

    const turn = c => this.turn == c ? ' > ' : '   '
    output[1] += paint.white(turn('white') + 'C: ' + this.white.caps.length)
    output[2] += paint.white(turn('white') + 'S: ' + this.white.stones.length)
    output[4] += paint.black(turn('black') + 'c: ' + this.black.caps.length)
    output[5] += paint.black(turn('black') + 's: ' + this.black.stones.length)

    return output.join('\n')
  }

  repeat(v) {
    return [...Array(this.size)].map(() => v)
  }

  sort_stacks() {
    const stacks = []
    for (let r = 0; r < this.size; r++) {
      stacks.push([])
      for (let f = 0; f < this.size; f++) {
        stacks[r].push(this.square(new Coords(f, r)).pieces)
      }
    }
    return stacks
  }

  symbol(piece) {
    if (piece.color == 'white')
      return piece instanceof Cap
        ? 'C'
        : (piece.standing ? 'S' : 'F')
    else
      return piece instanceof Cap
        ? 'c'
        : (piece.standing ? 's' : 'f')
  }
}
