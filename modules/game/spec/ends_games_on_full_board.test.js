import test from 'ava'
import { setup_game } from './fixture.js'
import Place from '../src/place.js'
import { Draw, FlatWin } from '../src/result.js'

test('white finishes and wins', t => {
  const game = setup_game(3, [
    ['F', 'f'],
    ['f', 'F', 'f'],
    ['F', 'f', 'F'],
  ])

  game.perform(Place.Flat.at(2, 2))

  t.deepEqual(game.result(), new FlatWin('white'))
})

test('black finishes and white wins', t => {
  const game = setup_game(3, [
    ['F', 'F'],
    ['f', 'F', 'f'],
    ['F', 'f', 'F'],
  ])

  game.board.turn = 'black'
  game.perform(Place.Flat.at(2, 2))

  t.deepEqual(game.result(), new FlatWin('white'))
})

test('black finishes and wins', t => {
  const game = setup_game(3, [
    ['F', 'f'],
    ['f', 'F', 'f'],
    ['f', 'f', 'F'],
  ])

  game.board.turn = 'black'
  game.perform(Place.Flat.at(2, 2))

  t.deepEqual(game.result(), new FlatWin('black'))
})

test('white finishes and draws', t => {
  const game = setup_game(4, [
    ['f', 'F', 'f',],
    ['F', 'f', 'F', 'f'],
    ['f', 'F', 'f', 'F'],
    ['F', 'f', 'F', 'f'],
  ])

  game.perform(Place.Flat.at(3, 3))

  t.deepEqual(game.result(), new Draw())
})

