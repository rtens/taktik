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
    this.squares = this.init_squares()
    this.chain_cache = {}
  }

  next() {
    if (this.turn == 'white')
      this.turn = 'black'
    else
      this.turn = 'white'
  }

  init_squares() {
    const squares = {}
    for (let file = 0; file < this.size; file++) {
      for (let rank = 0; rank < this.size; rank++) {
        const coords = new Coords(file, rank)
        squares[coords.name] = new Square(coords)
      }
    }
    return squares
  }

  square(coords) {
    const square = this.squares[coords.name]
    if (!square) throw new Error(`Not a square: ${coords.name}`)
    return square
  }

  applied(play) {
    const clone = this.clone()
    play.apply(clone, this.turn)
    clone.next()
    return clone
  }

  game_over() {
    if (this.road('white'))
      return new RoadWin('white')

    if (this.road('black'))
      return new RoadWin('black')

    if (this.finished()) {
      const { white, black } = this.flat_count()

      if (white > black) {
        return new FlatWin('white')
      } else if (black > white) {
        return new FlatWin('black')
      } else {
        return new Draw()
      }
    }

    return null
  }

  finished() {
    return this.full()
      || !this.white.count()
      || !this.black.count()
  }

  full() {
    return !Object.values(this.squares).find(s => s.empty())
  }

  clone() {
    const board = new Board(this.size)
    board.turn = this.turn
    board.white = this.white.clone()
    board.black = this.black.clone()
    board.squares = Object.entries(this.squares)
      .reduce((acc, [c, s]) => ({ ...acc, [c]: s.clone() }), {})

    return board
  }

  flat_count() {
    const counts = { white: 0, black: 0 }
    for (const square of Object.values(this.squares)) {
      const top = square.top()
      if (top instanceof Stone && !top.standing) {
        counts[top.color]++
      }
    }
    return counts
  }

  chains(color) {
    const checked = {}

    if (!this.chain_cache[color])
      this.chain_cache[color] = Object.values(this.squares)
        .map(square => this.build_chain(square, color, checked))
        .filter(chain => chain.length)

    return this.chain_cache[color]
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

  build_chain(square, color, checked) {
    const c = square.coords.name

    if (c in checked)
      return []

    checked[c] = true

    const top = square.top()
    if (square.empty() || top.standing || top.color != color)
      return []

    const chain = [square]

    const neighbors = Object.values(Move.directions)
      .map(dir => square.coords.moved(dir).name)
      .filter(n => n in this.squares)

    for (const n of neighbors) {
      chain.push(...this.build_chain(this.squares[n], color, checked))
    }

    return chain
  }

  print() {
    const repeat = v => [...Array(this.size)].map(() => v)
    let lines = ['  ,' + repeat('---').join('-') + ',']

    const stacks = []
    for (let r = 0; r < this.size; r++) {
      stacks.push([])
      for (let f = 0; f < this.size; f++) {
        stacks[r].push(this.square(new Coords(f, r)).pieces)
      }
    }

    const rows = []
    for (let r = this.size - 1; r >= 0; r--) {
      const max = Math.max(1, ...stacks[r].map(s => s.length))

      for (let l = max - 1; l >= 0; l--) {
        const row = []
        for (const stack of stacks[r]) {
          let p = ' '
          const piece = stack[l]

          if (piece) {
            if (piece instanceof Stone) {
              p = piece.standing ? 's' : 'f'
            } else if (piece instanceof Cap) {
              p = 'c'
            }

            if (piece.color == 'white') {
              p = p.toUpperCase()
            }
          }

          row.push(' ' + p + ' ')
        }
        rows.push((r + 1) + ' |' + row.join('|') + '|')
      }
      rows.push('  |' + repeat('---').join('-') + '|')
    }

    lines.push(...rows.slice(0, -1))
    lines.push("  '" + repeat('---').join('-') + "'")
    lines.push('   ' + [...Array(this.size).keys()]
      .map(i => ' ' + String.fromCharCode(97 + i) + ' ').join(' '))

    const output = lines.join('\n').split('\n')

    output[1] += '   C: ' + this.white.caps.length
    output[2] += '   S: ' + this.white.stones.length
    output[4] += '   c: ' + this.black.caps.length
    output[5] += '   s: ' + this.black.stones.length

    return output.join('\n')
  }
}
