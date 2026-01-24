import Coords from './coords.js'
import Move from './move.js'
import Square from './square.js'
import Stash from './stash.js'
import { Cap, Stone } from '../model/piece.js'

export default class Board {

  constructor(size) {
    this.size = size
    this.white = new Stash('white', stones[size], capstones[size])
    this.black = new Stash('black', stones[size], capstones[size])
    this.squares = this.init_squares()
  }

  init_squares() {
    const squares = {}
    for (let file = 0; file < this.size; file++) {
      for (let rank = 0; rank < this.size; rank++) {
        const coords = new Coords(file, rank)
        squares[coords.name()] = new Square(coords)
      }
    }
    return squares
  }

  square(coords) {
    const square = this.squares[coords.name()]
    if (!square) throw new Error(`Not a square: ${coords.name()}`)
    return square
  }

  full() {
    return !Object.values(this.squares).find(s => s.empty())
  }

  finished() {
    return this.full()
      || !this.white.count()
      || !this.black.count()

  }

  clone() {
    const board = new Board(this.size)
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

  road(color) {
    const squares = {}
    for (const coords in this.squares) {
      squares[coords] = this.squares[coords]
    }

    const checked = {}

    const neighbors = square =>
      Object.values(Move.directions)
        .map(dir => square.coords.moved(dir).name())
        .filter(n => n in this.squares)

    const build_chain = (chain, square, color) => {
      const c = square.coords.name()

      if (c in checked) {
        return
      }

      const top = square.top()
      if (square.empty() || top.standing) {
        checked[c] = true
        return
      }

      if (top.color != color) {
        return
      }

      checked[c] = true
      chain.push(square)

      for (const n of neighbors(square)) {
        build_chain(chain, this.squares[n], color)
      }
    }

    for (const square of Object.values(squares)) {
      const chain = []
      build_chain(chain, square, color)
      if (chain.length < this.size) continue

      const files = chain.map(s => s.coords.file)
      const ranks = chain.map(s => s.coords.rank)
      if (Math.min(...files) == 0 && Math.max(...files) == this.size - 1
        || Math.min(...ranks) == 0 && Math.max(...ranks) == this.size - 1
      ) {
        return chain
      }
    }

    return null
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

    return lines.join('\n')
  }
}

const stones = {
  3: 10,
  4: 15,
  5: 21,
  6: 30,
  7: 40,
  8: 50
}

const capstones = {
  3: 0,
  4: 0,
  5: 1,
  6: 1,
  7: 2,
  8: 2
}
