import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import { setup_game } from './lib/fixture.js'
import { Stone } from '../src/piece.js'

test('not a square', t => {
  const game = new Game(3)

  const error = t.throws(() =>
    game.perform(Place.Flat.at(3, 4)))

  t.is(error.message, 'Not a square: d5')
})

test('play not recorded', t => {
  const game = new Game(3)

  t.throws(() => game.perform(Place.Flat.at(3, 4)))
  game.perform(Place.Flat.at(0, 0))

  t.deepEqual(game.plays, [Place.Flat.at(0, 0)])
  t.like(game.board.squares, {
    a1: { pieces: [new Stone('black')] },
  })
})

test('first play not place flat', t => {
  const game = new Game(3)

  const error = t.throws(() =>
    game.perform(Place.Wall.at(0, 0)))

  t.is(error.message, 'Must place flat')
})

test('second play not place flat', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 1))

  const error = t.throws(() =>
    game.perform(Place.Wall.at(0, 0)))

  t.is(error.message, 'Must place flat')
})

test('place stack not second play', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 1))

  const error = t.throws(() =>
    game.perform(Place.Stack.at(0, 0)))

  t.is(error.message, 'Only allowed as first play')
})

test('square not empty', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Place.Flat.at(0, 0)))

  t.is(error.message, 'Square not empty')
})

test('out of flats', t => {
  const game = new Game(3)
  game.board.black.stones = []

  const error = t.throws(() =>
    game.perform(Place.Flat.at(0, 0)))

  t.is(error.message, 'No stones left')
})

test('out of walls', t => {
  const game = setup_game()
  game.board.white.stones = []

  const error = t.throws(() =>
    game.perform(Place.Wall.at(0, 0)))

  t.is(error.message, 'No stones left')
})

test('out of caps', t => {
  const game = setup_game()

  const error = t.throws(() =>
    game.perform(Place.Cap.at(0, 0)))

  t.is(error.message, 'No caps left')
})
