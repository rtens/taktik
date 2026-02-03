import Coords from '../src/coords.js'
import Game from '../src/game.js'
import { Cap, Stone } from '../src/piece.js'
import Stack from '../src/stack.js'

export function board(size, content) {
  const squares = {}

  for (const [r, row] of Object.entries(content))
    for (const [c, stack] of Object.entries(row))
      squares[coords(size, r, c).name] = {
        pieces: parse(stack).pieces
      }

  return { squares }
}

export function setup_game(size = 3, content = []) {
  const game = new Game(size)
  game.plays = [true, true]

  for (const c of ['white', 'black']) {
    game.board[c].stones = game.board[c].stones.map(() => new Stone(c))
    game.board[c].caps = game.board[c].caps.map(() => new Cap(c))
  }

  for (const [r, row] of Object.entries(content))
    for (const [c, stack] of Object.entries(row))
      game.board.square(coords(game.board.size, r, c))
        .stack(parse(stack))

  return game
}

function coords(size, r, c) {
  return new Coords(parseInt(c), size - 1 - parseInt(r))
}

function parse(stack) {
  return new Stack(stack.trim().split('').map(s => pieces[s]));
}

const pieces = {
  F: new Stone('white'),
  S: new Stone('white').stand(),
  C: new Cap('white'),
  f: new Stone('black'),
  s: new Stone('black').stand(),
  c: new Cap('black'),
}

