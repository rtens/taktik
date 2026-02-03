import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import Move from '../src/move.js'
import { setup_game } from './fixture.js'

test('not a square', t => {
  const game = setup_game()

  const error = t.throws(() =>
    game.perform(Move.at(4, 3)))

  t.is(error.message, 'Not a square: e4')
})

test('no direction', t => {
  const game = setup_game()

  const error = t.throws(() =>
    game.perform(Move.at(0, 0)))

  t.is(error.message, 'No direction')
})

test('no drops', t => {
  const game = setup_game()

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up()))

  t.is(error.message, 'No drops')
})

test('nothing to move', t => {
  const game = setup_game()

  const error = t.throws(() =>
    game.perform(Move.at(1, 1).up().drop(1)))

  t.is(error.message, 'Empty square')
})

test('not your stack', t => {
  const game = setup_game(3, [['f']])

  const error = t.throws(() =>
    game.perform(Move.at(0, 2).right().drop(1)))

  t.is(error.message, 'Not your stack')
})

test('over carry limit', t => {
  const game = setup_game(3, [['FFFF']])

  const error = t.throws(() =>
    game.perform(Move.at(0, 2).up().drop(4)))

  t.is(error.message, 'Over carry limit')
})

test('empty drop', t => {
  const game = setup_game(3, ['F'])

  const error = t.throws(() =>
    game.perform(Move.at(0, 2).right().drop(0)))

  t.is(error.message, 'Empty drop')
})

test('over stack size', t => {
  const game = setup_game(3, [['FF']])

  const error = t.throws(() =>
    game.perform(Move.at(0, 2).right().drop(3)))

  t.is(error.message, 'Over stack size')
})

test('drop on wall', t => {
  const game = setup_game(3, [['F', 'S']])

  const error = t.throws(() =>
    game.perform(Move.at(0, 2).right().drop(1)))

  t.is(error.message, 'Drop on wall')
})

test('drop on cap', t => {
  const game = setup_game(3, [['F', 'c']])

  const error = t.throws(() =>
    game.perform(Move.at(0, 2).right().drop(1)))

  t.is(error.message, 'Drop on cap')
})
