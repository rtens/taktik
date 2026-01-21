import Coords from './coords.js'
import { Capstone, Stone } from './piece.js'

class Play {

  constructor(coords) {
    this.coords = coords
  }

  static at(file, rank) {
    return new this(new Coords(file, rank))
  }

  apply(_board, _color) {
    throw new Error('not implemented')
  }

  ptn() {
    throw new Error('not implemented')
  }
}

export function parse(ptn) {
  if (ptn.length == 2) {
    return new PlaceFlat(parse_coords(ptn))

  } else if (ptn.startsWith('S')) {
    return new PlaceWall(parse_coords(ptn.slice(1)))

  } else if (ptn.startsWith('C')) {
    return new PlaceCapstone(parse_coords(ptn.slice(1)))

  } else if (ptn.length == 3) {
    return new Move(parse_coords(ptn))
      .to(ptn.slice(2))
      .drop(1)

  } else if (ptn.length == 4) {
    return new Move(parse_coords(ptn.slice(1)))
      .to(ptn.slice(3))
      .drop(parseInt(ptn.slice(0, 1)))

  } else {
    const move = new Move(parse_coords(ptn.slice(1)))
      .to(ptn.slice(3, 4))
    move.drops = ptn.slice(4).split('').map(n => parseInt(n))
    return move
  }
}

function parse_coords(coords) {
  return new Coords(
    coords.charCodeAt(0) - 97,
    parseInt(coords[1]) - 1)
}

export class Place extends Play {

  apply(board, color) {
    const square = board.square(this.coords)
    if (!square.empty()) {
      throw new Error('Square not empty')
    }

    square.stack(this.take_piece(board[color]))
  }

  ptn() {
    return this.prefix() + this.coords.name()
  }

  take_piece(_stash) {
    throw new Error('not implemented')
  }

  prefix() {
    throw new Error('not implemented')
  }
}

export class PlaceFlat extends Place {

  take_piece(stash) {
    return stash.take_flat()
  }

  prefix() {
    return ''
  }
}

export class PlaceWall extends Place {

  take_piece(stash) {
    return stash.take_wall()
  }

  prefix() {
    return 'S'
  }
}

export class PlaceCapstone extends Place {

  take_piece(stash) {
    return stash.take_capstone()
  }

  prefix() {
    return 'C'
  }
}

export class Move extends Play {

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

    if (square.top() instanceof Capstone)
      throw new Error("Can't stack on capstone")

    if (square.top() instanceof Stone
      && (square.top()).standing
      && !(dropped.pieces[0] instanceof Capstone)
    )
      throw new Error("Can't stack on wall")
  }

  ptn() {
    let ptn = this.coords.name() + this.symbol

    if (this.taken() > 1)
      ptn = this.taken() + ptn

    if (this.drops.length > 1)
      ptn += this.drops.join('')

    return ptn
  }
}