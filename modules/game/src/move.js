import Play from './play.js'
import Coords from './coords.js'
import { Cap, Stone } from './piece.js'
import Stack from './stack.js'

export default class Move extends Play {

  static directions = {
    up: new Coords(0, 1),
    down: new Coords(0, -1),
    right: new Coords(1, 0),
    left: new Coords(-1, 0)
  }

  constructor(coords) {
    super(coords)
    this.direction = null
    this.symbol = null
    this.drops = []
  }

  to(direction) {
    this.direction = direction
    return this
  }

  up() {
    return this.to(Move.directions.up)
  }

  down() {
    return this.to(Move.directions.down)
  }

  right() {
    return this.to(Move.directions.right)
  }

  left() {
    return this.to(Move.directions.left)
  }

  dropping(drops) {
    this.drops = drops
    return this
  }

  drop(number) {
    this.drops.push(number)
    return this
  }

  taken() {
    return this.drops.reduce((s, n) => s + n, 0)
  }

  apply(board) {
    const square = board.square(this.coords)
    this.validate_move(board, square)
    const stack = square.take(this.taken())

    let coords = this.coords
    for (const drop of this.drops) {
      coords = coords.moved(this.direction)

      const square = board.square(coords)
      const dropped = stack.drop(drop)

      this.validate_drop(square, dropped)

      if (square.top() && square.top().standing)
        this.smashed = true

      square.stack(dropped)
    }
  }

  revert(board) {
    const stack = new Stack()

    let coords = this.coords
    for (const drop of this.drops) {
      coords = coords.moved(this.direction)

      const square = board.square(coords)
      stack.add(square.take(drop))
    }

    if (this.smashed)
      board.square(coords).top().stand()

    board.square(this.coords).stack(stack)
  }

  validate_move(board, square) {
    if (!this.direction)
      throw new Error('No direction')

    if (!this.drops.length)
      throw new Error('No drops')

    if (square.empty())
      throw new Error('Empty square')

    if (square.top().color != board.turn)
      throw new Error(`Not your stack`)

    if (this.taken() > board.size)
      throw new Error(`Over carry limit`)
  }

  validate_drop(square, dropped) {
    if (!dropped.pieces.length)
      throw new Error('Empty drop')

    if (square.top() instanceof Cap)
      throw new Error('Drop on cap')

    if (square.top() instanceof Stone
      && (square.top()).standing
      && !(dropped.pieces[0] instanceof Cap)
    )
      throw new Error('Drop on wall')
  }

  // ptn() {
  //   let ptn = this.coords.name + this.symbol

  //   if (this.taken() > 1)
  //     ptn = this.taken() + ptn

  //   if (this.drops.length > 1)
  //     ptn += this.drops.join('')

  //   return ptn
  // }
}
