import test from 'ava'
import Board from '../../src/model/board.js'
import Bot from '../../src/players/bot.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('empty board', t => {
  const board = new Board(5)

  t.is(new Bot().evaluate(board), 0)
})

test('white more flats', t => {
  const board = new Board(5)
  stack(board, 'a1', new Stone('white'))

  t.is(new Bot().evaluate(board), 10)
})

test('black more flats', t => {
  const board = new Board(5)
  stack(board, 'a1', new Stone('white'))
  stack(board, 'a2', new Stone('black'))
  stack(board, 'a3', new Stone('black'))
  stack(board, 'a4', new Stone('black'))

  t.is(new Bot().evaluate(board), -20)
})

test('white lower on stash', t => {
  const board = new Board(5)
  board.white.take_flat()

  t.is(new Bot().evaluate(board), 1)
})

test('black lower on stash', t => {
  const board = new Board(5)
  board.white.take_flat()
  board.black.take_flat()
  board.black.take_flat()
  board.black.take_flat()

  t.is(new Bot().evaluate(board), -2)
})

test('white has road', t => {
  const board = new Board(5)
  stack(board, 'a1', new Stone('white'))
  stack(board, 'a2', new Stone('white'))
  stack(board, 'a3', new Stone('white'))
  stack(board, 'a4', new Stone('white'))
  stack(board, 'a5', new Stone('white'))

  t.is(new Bot().evaluate(board), 9000)
})

test('black has road', t => {
  const board = new Board(5)
  stack(board, 'a1', new Stone('black'))
  stack(board, 'a2', new Stone('black'))
  stack(board, 'a3', new Stone('black'))
  stack(board, 'a4', new Stone('black'))
  stack(board, 'a5', new Stone('black'))

  t.is(new Bot().evaluate(board), -9000)
})

test.todo('white has tak')

test.todo('black has tak')

test.todo('...')

function stack(board, fr, ...pieces) {
  board.squares[fr].stack(new Stack(pieces))
}
