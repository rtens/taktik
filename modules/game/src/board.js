import Stash from './stash.js'
import Square from './square.js'
import Move from './move.js'
import { Draw, FlatWin, RoadWin } from './result.js'
import { Stone } from './piece.js'

export default class Board {

  constructor(size) {
    this.size = size
    this.turn = 'white'
    this.white = new Stash('white', size)
    this.black = new Stash('black', size)
    this.init_squares()
    this.init_neighbors()
  }

  init_squares() {
    this.squares = {}
    this.squares_list = []

    for (let file = 0; file < this.size; file++) {
      for (let rank = 0; rank < this.size; rank++) {
        const square = Square.at(file, rank)
        this.squares[square.coords.name] = square
        this.squares_list.push(square)
      }
    }
  }

  init_neighbors() {
    this.neighbors = {}
    for (const [c, s] of Object.entries(this.squares))
      this.neighbors[c] = Object.values(Move.directions)
        .map(dir => s.coords.moved(dir).name)
        .filter(n => n in this.squares)
  }

  square(coords) {
    const square = this.squares[coords.name]
    if (!square) throw new Error(`Not a square: ${coords.name}`)
    return square
  }

  apply(play) {
    play.apply(this)
    this.next()
  }

  revert(play) {
    this.next()
    play.revert(this)
  }

  next() {
    if (this.turn == 'white')
      this.turn = 'black'
    else
      this.turn = 'white'
  }

  game_over() {
    // if (this.game_over_cache !== undefined)
    //   return this.game_over_cache

    const other = this.turn == 'white'
      ? 'black' : 'white'

    let over = null

    if (this.road(other)) {
      over = new RoadWin(other)

    } else if (this.road(this.turn)) {
      over = new RoadWin(this.turn)

    } else if (this.finished()) {
      const { white, black } = this.flat_count()

      if (white > black) {
        over = new FlatWin('white')
      } else if (black > white) {
        over = new FlatWin('black')
      } else {
        over = new Draw()
      }
    }

    // this.game_over_cache = over
    return over
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

    // if (!this.chain_cache[color])
    // this.chain_cache[color] = 
    return this.squares_list
      .map(square => this.build_chain(square, color, checked))
      .filter(chain => chain.length)

    // return this.chain_cache[color]
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
}
