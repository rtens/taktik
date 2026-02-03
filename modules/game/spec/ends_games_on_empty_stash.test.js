import test from 'ava'
import { setup_game } from './fixture.js'
import Game from '../src/game.js'
import Place from '../src/place.js'
import { Draw, FlatWin } from '../src/result.js'
import { Stone } from '../src/piece.js'

test('not over yet', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 2))

  const result = game.result()
  t.is(result, null)
})

test('white finishes and wins', t => {
  const game = setup_game(3, [['f', 'F']])
  game.board.white.stones = [new Stone('white')]

  game.perform(Place.Flat.at(2, 2))

  const result = game.result()
  t.deepEqual(result, new FlatWin('white'))
})

test('black finishes and white wins', t => {
  const game = setup_game(3, [['F', 'F']])
  game.board.black.stones = [new Stone('black')]
  game.board.turn = 'black'

  game.perform(Place.Flat.at(2, 2))

  const result = game.result()
  t.deepEqual(result, new FlatWin('white'))
})

test('white finishes and black wins', t => {
  const game = setup_game(3, [['f', 'f']])
  game.board.white.stones = [new Stone('white')]

  game.perform(Place.Flat.at(2, 2))

  const result = game.result()
  t.deepEqual(result, new FlatWin('black'))
})

test('white finishes and draws', t => {
  const game = setup_game(3, [['f']])
  game.board.white.stones = [new Stone('white')]

  game.perform(Place.Flat.at(2, 2))

  const result = game.result()
  t.deepEqual(result, new Draw())
})
