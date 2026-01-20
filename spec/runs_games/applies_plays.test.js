import test from 'ava'
import Game from '../../src/model/game.js'
import { Move, PlaceCapstone, PlaceFlat, PlaceWall } from '../../src/model/play.js'
import { Capstone, Stone } from '../../src/model/piece.js'
import Stack from '../../src/model/stack.js'

test('place start flats', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  t.is(game.board.white.stones.length, 9)
  t.is(game.board.black.stones.length, 9)

  for (const [coords, square] of Object.entries(game.board.squares)) {
    if (coords == 'a1')
      t.like(square.pieces, [new Stone('black')])
    else if (coords == 'c3')
      t.like(square.pieces, [new Stone('white')])
    else
      t.like(square.pieces, [undefined])
  }
})

test('place regular flat', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  perform(t, game,
    PlaceFlat.at(1, 1),
    'b2')

  check(t, game, 'b2', [new Stone('white')])
  t.is(game.board.white.stones.length, 8)
  t.is(game.board.black.stones.length, 9)
})

test('place wall', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  perform(t, game,
    PlaceWall.at(1, 1),
    'Sb2')

  check(t, game, 'b2', [new Stone('white').stand()])
  t.is(game.board.white.stones.length, 8)
  t.is(game.board.black.stones.length, 9)
})

test('place capstone', t => {
  const game = new Game(5)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  perform(t, game,
    PlaceCapstone.at(1, 1),
    'Cb2')

  check(t, game, 'b2', [new Capstone('white')])
  t.is(game.board.white.capstones.length, 0)
  t.is(game.board.black.capstones.length, 1)
})

test('move right', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(1, 1))

  perform(t, game,
    Move.at(1, 1).right().drop(1),
    'b2>')

  check(t, game, 'b2', [])
  check(t, game, 'c2', [new Stone('white')])
})

test('move up', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(1, 1))

  perform(t, game,
    Move.at(1, 1).up().drop(1),
    'b2+')

  check(t, game, 'b2', [])
  check(t, game, 'b3', [new Stone('white')])
})

test('move left', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(1, 1))

  perform(t, game,
    Move.at(1, 1).left().drop(1),
    'b2<')

  check(t, game, 'b2', [])
  check(t, game, 'a2', [new Stone('white')])
})

test('move down', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(1, 1))

  perform(t, game,
    Move.at(1, 1).down().drop(1),
    'b2-')

  check(t, game, 'b2', [])
  check(t, game, 'b1', [new Stone('white')])
})

test('move on flat', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(1, 0))

  game.perform(Move.at(1, 0).left().drop(1))

  check(t, game, 'a1', [
    new Stone('black'),
    new Stone('white')
  ])
})

test('move stack', t => {
  const game = new Game(3)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  game.board.squares['b1'].stack(new Stack([
    new Stone('black'),
    new Stone('white')
  ]))

  perform(t, game,
    Move.at(1, 0).left().drop(2),
    '2b1<')

  check(t, game, 'a1', [
    new Stone('black'),
    new Stone('black'),
    new Stone('white')
  ])
  check(t, game, 'b1', [])
})

test('spread stack', t => {
  const game = new Game(4)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  game.board.squares['a1'].stack(new Stack([
    new Stone('white'),
    new Stone('black'),
    new Stone('white'),
    new Stone('white').stand(),
  ]))

  perform(t, game,
    Move.at(0, 0).right().drop(1).drop(2).drop(1),
    '4a1>121')

  check(t, game, 'a1', [new Stone('black')])
  check(t, game, 'b1', [new Stone('white')])
  check(t, game, 'c1', [new Stone('black'), new Stone('white')])
  check(t, game, 'd1', [new Stone('white').stand()])
})

test('flatten wall', t => {
  const game = new Game(5)
  game.perform(PlaceFlat.at(0, 0))
  game.perform(PlaceFlat.at(2, 2))

  game.board.squares['a1'].stack(new Stack([
    new Stone('black').stand(),
  ]))
  game.board.squares['b1'].stack(new Stack([
    new Capstone('white'),
  ]))

  game.perform(Move.at(1, 0).left().drop(1))

  check(t, game, 'a1', [
    new Stone('black'),
    new Stone('black'),
    new Capstone('white')
  ])
})

function perform(t, game, play, ptn) {
  game.perform(play)
  t.is(play.ptn(), ptn)
}

function check(t, game, coords, pieces) {
  t.deepEqual(game.board.squares[coords].pieces, pieces)
}