import test from 'ava'
import Board from '../../src/model/board.js'
import Bot from '../../src/players/bot.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('empty board', t => {
  const board = new Board(5)

  t.is(new Bot().evaluate(board), 0)
  board.turn = 'black'
  t.is(new Bot().evaluate(board), -0)
})

test('more flats more better', t => {
  const board = new Board(5)
  stack(board, 'a1', new Stone('white'))

  t.is(new Bot().evaluate(board), 10)
  board.turn = 'black'
  t.is(new Bot().evaluate(board), -10)
})

test('negative flats diff', t => {
  const board = new Board(5)

  stack(board, 'a1', new Stone('white'))
  stack(board, 'b2', new Stone('black'))
  stack(board, 'c3', new Stone('black'))
  stack(board, 'd4', new Stone('black'))

  t.is(new Bot().evaluate(board), -20)
  board.turn = 'black'
  t.is(new Bot().evaluate(board), 20)
})

test('less stash more better', t => {
  const board = new Board(5)
  board.white.take_flat()

  t.is(new Bot().evaluate(board), 10)
  board.turn = 'black'
  t.is(new Bot().evaluate(board), -10)
})

test('negative stash diff', t => {
  const board = new Board(5)
  board.turn = 'white'

  board.white.take_flat()
  board.black.take_flat()
  board.black.take_flat()
  board.black.take_flat()

  t.is(new Bot().evaluate(board), -20)
  board.turn = 'black'
  t.is(new Bot().evaluate(board), 20)
})

test('the longer chains the better', t => {
  const board = new Board(5)

  stack(board, 'a1', new Stone('white'))
  stack(board, 'a2', new Stone('white'))
  stack(board, 'b2', new Stone('white'))
  stack(board, 'c2', new Stone('white'))
  stack(board, 'e5', new Stone('white'))

  t.is(new Bot().evaluate(board), 90)
  board.turn = 'black'
  t.is(new Bot().evaluate(board), -90)
})

test('tak is better', t => {
  const board = new Board(3)
  board.black.take_flat()
  board.white.take_flat()

  stack(board, 'a1', new Stone('white'))
  stack(board, 'a3', new Stone('white'))

  board.turn = 'black'
  t.is(new Bot().evaluate(board), -1020, board.turn)

  board.turn = 'white'
  t.is(new Bot().evaluate(board), 20, board.turn)
})

function stack(board, fr, ...pieces) {
  board.squares[fr].stack(new Stack(pieces))
}
