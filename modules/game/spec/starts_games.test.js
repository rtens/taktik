import test from 'ava'
import Game from '../src/game.js'

test('white starts', t => {
  const game = new Game(3)

  t.is(game.board.turn, 'white')
})

test('first stone in stash is other color', t => {
  const game = new Game(3)

  t.deepEqual(game.board.white.stones.slice(-3).map(p => p.color), [
    'white', 'white', 'black'
  ])

  t.deepEqual(game.board.black.stones.slice(-3).map(p => p.color), [
    'black', 'black', 'white'
  ])
})

test('stashes sizes', t => {
  assert_stash(3, 10, 0)
  assert_stash(4, 15, 0)
  assert_stash(5, 21, 1)
  assert_stash(6, 30, 1)
  assert_stash(7, 40, 2)
  assert_stash(8, 50, 2)

  function assert_stash(size, stones, caps) {
    const game = new Game(size)

    t.is(game.board.white.stones.length, stones)
    t.is(game.board.white.caps.length, caps)

    t.is(game.board.black.stones.length, stones)
    t.is(game.board.black.caps.length, caps)
  }
})

