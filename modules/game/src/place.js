import Play from './play.js'

export default class Place extends Play {

  apply(board) {
    const square = board.square(this.coords)
    if (!square.empty())
      throw new Error('Square not empty')

    square.stack(this.take_piece(board[board.turn]))
  }

  revert(board) {
    const stack = board.square(this.coords).take(1)
    board[board.turn].put(stack)
  }

  // ptn() {
  //   return this.prefix() + this.coords.name
  // }

  take_piece(_stash) {
    throw new Error('not implemented')
  }

  // prefix() {
  //   throw new Error('not implemented')
  // }
}

Place.Flat = class extends Place {

  take_piece(stash) {
    return stash.take_flat()
  }

  // prefix() {
  //   return ''
  // }
}

Place.Wall = class extends Place {

  take_piece(stash) {
    return stash.take_wall()
  }

  // prefix() {
  //   return 'S'
  // }
}

Place.Cap = class extends Place {

  take_piece(stash) {
    return stash.take_cap()
  }

  // prefix() {
  //   return 'C'
  // }
}