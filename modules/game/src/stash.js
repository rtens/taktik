import Stack from './stack.js'
import { Stone, Cap } from './piece.js'

const pieces = {
  3: [10, 0],
  4: [15, 0],
  5: [21, 1],
  6: [30, 1],
  7: [40, 2],
  8: [50, 2]
}

export default class Stash {

  constructor(color, size) {
    const opponent = color == 'white' ? 'black' : 'white'
    const [stones, caps] = pieces[size]

    this.stones = [
      ...[...new Array(stones - 1)].map(() =>
        new Stone(color)),
      new Stone(opponent),
    ]
    this.caps = [...new Array(caps)].map(() =>
      new Cap(color))
  }

  count() {
    return this.stones.length + this.caps.length
  }

  take_flat() {
    if (!this.stones.length)
      throw new Error('No stones left')
    return Stack.of(this.stones.pop())
  }

  take_wall() {
    if (!this.stones.length)
      throw new Error('No stones left')
    return Stack.of(this.stones.pop().stand())
  }

  take_cap() {
    if (!this.caps.length)
      throw new Error('No caps left')
    return Stack.of(this.caps.pop())
  }

  put(stack) {
    for (const piece of stack.pieces) {
      if (piece instanceof Stone) {
        this.stones.push(piece.flat())
      } else {
        this.caps.push(piece)
      }
    }
  }
}
