import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import { setup_game } from './fixture.js'

test('not a square', t => {
  const game = new Game(3)

  const error = t.throws(() =>
    game.perform(Place.Flat.at(3, 4)))

  t.is(error.message, 'Not a square: d5')
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

test('square not empty', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Place.Flat.at(0, 0)))

  t.is(error.message, 'Square not empty')
})

test('out of flats', t => {
  const game = new Game(3)
  game.board.white.stones = []

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
