import Coords from './coords.js'
import Square from './square.js'
import Stash from './stash.js'

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

  filled() {
    return !Object.values(this.squares).find(s => s.empty())
  }

  clone() {
    const board = new Board(this.size)
    board.white = this.white.clone()
    board.black = this.black.clone()
    board.squares = Object.entries(this.squares)
      .reduce((acc, [c, s]) => ({ ...acc, [c]: s.clone() }), {})

    return board
  }

  road() {
    const squares = {}
    for (const coords in this.squares) {
      squares[coords] = this.squares[coords]
    }

    const checked = {}

    const neighbors = square =>
      [[0, -1], [0, 1], [-1, 0], [1, 0]]
        .map(([f, r]) =>
          square.coords.moved(new Coords(f, r)).name())
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
      for (const color of ['white', 'black']) {
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
    }

    return null
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