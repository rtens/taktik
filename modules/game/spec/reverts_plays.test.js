import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import Move from '../src/move.js'
import { Cap, Stone } from '../src/piece.js'
import Stack from '../src/stack.js'

test('place flat', t => {
  const game = start()

  const play = Place.Flat.at(1, 1)
  game.board.apply(play)
  game.board.revert(play)

  t.is(game.board.turn, 'white')
  t.is(game.board.white.stones.length, 9)
  t.like(game.board.squares, {
    b2: { pieces: [undefined] }
  })
})

test('place wall', t => {
  const game = start()

  const play = Place.Wall.at(1, 1)
  game.board.apply(play)
  game.board.revert(play)

  t.is(game.board.white.stones.length, 9)
  t.like(game.board.squares, {
    b2: { pieces: [undefined] }
  })
  t.like(game.board.white.stones.slice(-1), [
    new Stone('white')
  ])
})

test('place cap', t => {
  const game = start(5)

  const play = Place.Cap.at(1, 1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board.squares, {
    b2: { pieces: [undefined] }
  })
  t.like(game.board.white.caps, [
    new Cap('white')
  ])
})

test('move one', t => {
  const game = start()
  game.board.squares['a2'].stack(Stack.of(
    new Stone('white').stand()
  ))

  const play = Move.at(0, 1).right().drop(1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board.squares, {
    a2: { pieces: [new Stone('white').stand()] },
    b2: { pieces: [undefined] },
  })
})

test('spread stack', t => {
  const game = start()
  game.board.squares['a2'].stack(Stack.of(
    new Stone('black'),
    new Stone('white'),
    new Stone('black'),
    new Stone('white').stand(),
  ))

  const play = Move.at(0, 1).right().drop(1).drop(2)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board.squares, {
    a2: {
      pieces: [
        new Stone('black'),
        new Stone('white'),
        new Stone('black'),
        new Stone('white').stand()
      ]
    },
    b2: { pieces: [undefined] },
    c2: { pieces: [undefined] },
  })
})

test('smash wall', t => {
  const game = start()
  game.board.squares['a2'].stack(Stack.of(
    new Cap('white')
  ))
  game.board.squares['b2'].stack(Stack.of(
    new Stone('black'),
    new Stone('white').stand(),
  ))

  const play = Move.at(0, 1).right().drop(1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board.squares, {
    a2: {
      pieces: [
        new Cap('white')
      ]
    },
    b2: {
      pieces: [
        new Stone('black'),
        new Stone('white').stand(),
      ]
    },
  })
})

test('no smash', t => {
  const game = start()
  game.board.squares['a2'].stack(Stack.of(
    new Cap('white')
  ))
  game.board.squares['b2'].stack(Stack.of(
    new Stone('black'),
    new Stone('white'),
  ))

  const play = Move.at(0, 1).right().drop(1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board.squares, {
    b2: {
      pieces: [
        new Stone('black'),
        new Stone('white'),
      ]
    },
  })
})

function start(size = 3) {
  const game = new Game(size)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(0, 2))
  return game
}

