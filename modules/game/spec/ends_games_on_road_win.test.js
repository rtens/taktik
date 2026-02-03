import test from 'ava'
import Place from '../src/place.js'
import { RoadWin } from '../src/result.js'
import Move from '../src/move.js'
import { setup_game } from './fixture.js'

test('white road', t => {
  const game = setup_game(3, [[], ['F', 'F']])

  game.perform(Place.Flat.at(2, 1))

  t.deepEqual(game.result(), new RoadWin('white'))
})

test('black road', t => {
  const game = setup_game(3, [[], ['f', 'f']])
  game.board.turn = 'black'

  game.perform(Place.Flat.at(2, 1))

  t.deepEqual(game.result(), new RoadWin('black'))
})

test('winding road', t => {
  const game = setup_game(4, [
    ['F', 'F'],
    [' ', 'F'],
    [' ', 'F', 'F']
  ])

  game.perform(Place.Flat.at(3, 1))

  t.deepEqual(game.result(), new RoadWin('white'))
})

test('white finishes black road', t => {
  const game = setup_game(3, [['f', 'f', 'fF']])

  game.perform(Move.at(2, 2).down().drop(1))

  t.deepEqual(game.result(), new RoadWin('black'))
})

test('white finishes both roads', t => {
  const game = setup_game(3, [
    ['f', 'f', 'fF'],
    ['F', 'F']
  ])

  game.perform(Move.at(2, 2).down().drop(1))

  t.deepEqual(game.result(), new RoadWin('white'))
})

test('black finishes both roads', t => {
  const game = setup_game(3, [
    ['f', 'f'],
    ['F', 'F', 'Ff']
  ])
  game.board.turn = 'black'

  game.perform(Move.at(2, 1).up().drop(1))

  t.deepEqual(game.result(), new RoadWin('black'))
})
