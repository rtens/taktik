import Play from './play.js'
import Coords from './coords.js'
import { Cap, Stone } from './piece.js'

export default class Move extends Play {

  static directions = {
    '+': new Coords(0, 1),
    '-': new Coords(0, -1),
    '>': new Coords(1, 0),
    '<': new Coords(-1, 0)
  }

  constructor(coords) {
    super(coords)
    this.direction = null
    this.symbol = null
    this.drops = []
  }

  to(symbol) {
    this.symbol = symbol
    this.direction = Move.directions[symbol]
    return this
  }

  dropping(drops) {
    this.drops = drops
    return this
  }

  up() {
    return this.to('+')
  }

  down() {
    return this.to('-')
  }

  right() {
    return this.to('>')
  }

  left() {
    return this.to('<')
  }

  drop(number) {
    this.drops.push(number)
    return this
  }

  taken() {
    return this.drops.reduce((s, n) => s + n, 0)
  }

  apply(board, color) {
    let coords = this.coords
    const square = board.square(coords)

    this.validate_move(board, square, color)

    const stack = square.take(this.taken())
    for (const drop of this.drops) {
      coords = coords.moved(this.direction)

      const square = board.square(coords)
      const dropped = stack.drop(drop)

      this.validate_drop(square, dropped)

      square.stack(dropped)
    }
  }

  validate_move(board, square, color) {
    if (!this.direction)
      throw new Error('Direction missing')

    if (this.taken() > board.size)
      throw new Error(`Carry limit is ${board.size}`)

    if (!this.drops.length)
      throw new Error('No drops')

    if (square.empty())
      throw new Error('Empty square')

    if (square.top().color != color)
      throw new Error(`Not ${color}'s stack`)
  }

  validate_drop(square, dropped) {
    if (!dropped.pieces.length)
      throw new Error('Empty drop')

    if (square.top() instanceof Cap)
      throw new Error("Can't stack on cap")

    if (square.top() instanceof Stone
      && (square.top()).standing
      && !(dropped.pieces[0] instanceof Cap)
    )
      throw new Error("Can't stack on wall")
  }

  ptn() {
    let ptn = this.coords.name + this.symbol

    if (this.taken() > 1)
      ptn = this.taken() + ptn

    if (this.drops.length > 1)
      ptn += this.drops.join('')

    return ptn
  }
}