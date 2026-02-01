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

  take_flat() {
    return Stack.of(this.stones.pop())
  }
}