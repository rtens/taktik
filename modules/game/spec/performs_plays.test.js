import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import Move from '../src/move.js'
import { Cap, Stone } from '../src/piece.js'
import { board, setup_game } from './fixture.js'

test('takes turns', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 0))
  t.is(game.board.turn, 'black')

  game.perform(Place.Flat.at(0, 1))
  t.is(game.board.turn, 'white')
})

test('records plays', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 0))
  t.deepEqual(game.plays, [
    Place.Flat.at(0, 0)
  ])

  game.perform(Place.Flat.at(0, 1))
  t.deepEqual(game.plays, [
    Place.Flat.at(0, 0),
    Place.Flat.at(0, 1)
  ])
})

test('starting plays', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 2))
  game.perform(Place.Flat.at(1, 2))

  t.is(game.board.white.stones.length, 9)
  t.is(game.board.black.stones.length, 9)
  t.like(game.board, board(3, [['f', 'F']]))
})

test('place flat', t => {
  const game = setup_game()

  game.perform(Place.Flat.at(0, 2))

  t.like(game.board, board(3, [
    ['F']
  ]))
})

test('place wall', t => {
  const game = setup_game()

  game.perform(Place.Wall.at(0, 2))

  t.like(game.board, board(3, [
    ['S']
  ]))
})

test('place cap', t => {
  const game = setup_game(3, [])
  game.board.white.caps = [new Cap('white')]

  game.perform(Place.Cap.at(0, 2))

  t.like(game.board, board(3, [
    ['C']
  ]))
})

test('move right', t => {
  const game = setup_game(3, [
    ['F']
  ])

  game.perform(Move.at(0, 2).right().drop(1))

  t.like(game.board, board(3, [
    ['', 'F']
  ]))
})

test('move up', t => {
  const game = setup_game(3, [
    [' '],
    ['F']
  ])

  game.perform(Move.at(0, 1).up().drop(1))

  t.like(game.board, board(3, [
    ['F'],
    [' ']
  ]))
})

test('move left', t => {
  const game = setup_game(3, [
    ['', 'F']
  ])

  game.perform(Move.at(1, 2).left().drop(1))

  t.like(game.board, board(3, [
    ['F', '']
  ]))
})

test('move down', t => {
  const game = setup_game(3, [
    ['F']
  ])

  game.perform(Move.at(0, 2).down().drop(1))

  t.like(game.board, board(3, [
    [' '],
    ['F']
  ]))
})

test('move on flat', t => {
  const game = setup_game(3, [
    ['F', 'f']
  ])

  game.perform(Move.at(0, 2).right().drop(1))

  t.like(game.board, board(3, [
    ['', 'fF']
  ]))
})

test('move stack', t => {
  const game = setup_game(3, [
    ['FfS']
  ])

  game.perform(Move.at(0, 2).right().drop(2))

  t.like(game.board, board(3, [
    ['F', 'fS']
  ]))
})

test('spread stack', t => {
  const game = setup_game(4, [
    [],
    ['FfFfS']
  ])

  game.perform(Move.at(0, 2).right()
    .drop(1)
    .drop(2)
    .drop(1))

  t.like(game.board, board(4, [
    [],
    ['F', 'f', 'Ff', 'S']
  ]))
})

test('smash wall', t => {
  const game = setup_game(3, [
    ['C', 'fS']
  ])

  game.perform(Move.at(0, 2).right().drop(1))

  t.like(game.board, board(3, [
    ['', 'fFC']
  ]))
})
