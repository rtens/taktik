import { Capstone, Stone } from './piece.js'
import Stack from './stack.js'

export default class Stash {

  constructor(color, stones, capstones = 0) {
    this.color = color
    this.stones = [...Array(stones)].map(() => new Stone(color))
    this.capstones = [...Array(capstones)].map(() => new Capstone(color))
  }

  take_flat() {
    if (!this.stones.length) {
      throw new Error('No stones left')
    }
    return Stack.of(this.stones.pop())
  }

  take_wall() {
    if (!this.stones.length) {
      throw new Error('No stones left')
    }
    return Stack.of(this.stones.pop().stand())
  }

  take_capstone() {
    if (!this.capstones.length) {
      throw new Error('No capstones left')
    }
    return Stack.of(this.capstones.pop())
  }

  put(stack) {
    for (const piece of stack.pieces) {
      if (piece instanceof Stone) {
        this.stones.push(piece.flat())
      } else {
        this.capstones.push(piece)
      }
    }
  }

  empty() {
    return !this.stones.length && !this.capstones.length
  }

  clone() {
    return new Stash(
      this.color,
      this.stones.length,
      this.capstones.length)
  }
}