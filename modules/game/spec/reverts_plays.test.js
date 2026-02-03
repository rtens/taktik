import test from 'ava'
import Place from '../src/place.js'
import Move from '../src/move.js'
import { Cap, Stone } from '../src/piece.js'
import { board, setup_game } from './fixture.js'

test('place flat', t => {
  const game = setup_game()

  const play = Place.Flat.at(0, 2)
  game.board.apply(play)
  game.board.revert(play)

  t.is(game.board.turn, 'white')
  t.is(game.board.white.stones.length, 10)
  t.like(game.board, board(3, [
    ['']
  ]))
})

test('place wall', t => {
  const game = setup_game()

  const play = Place.Wall.at(0, 2)
  game.board.apply(play)
  game.board.revert(play)

  t.is(game.board.white.stones.length, 10)
  t.like(game.board.white.stones.slice(-1), [
    new Stone('white')
  ])
  t.like(game.board, board(3, [
    ['']
  ]))
})

test('place cap', t => {
  const game = setup_game(5)

  const play = Place.Cap.at(0, 2)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board.white.caps, [
    new Cap('white')
  ])
  t.like(game.board, board(3, [
    ['']
  ]))
})

test('move one', t => {
  const game = setup_game(3, [
    ['fS']
  ])

  const play = Move.at(0, 2).right().drop(1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board, board(3, [
    ['fS']
  ]))
})

test('spread stack', t => {
  const game = setup_game(3, [
    ['fFfS']
  ])

  const play = Move.at(0, 2).right().drop(1).drop(2)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board, board(3, [
    ['fFfS']
  ]))
})

test('smash wall', t => {
  const game = setup_game(3, [
    ['C', 'fS']
  ])

  const play = Move.at(0, 2).right().drop(1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board, board(3, [
    ['C', 'fS']
  ]))
})

test('no smash', t => {
  const game = setup_game(3, [
    ['C', 'fF']
  ])

  const play = Move.at(0, 2).right().drop(1)
  game.board.apply(play)
  game.board.revert(play)

  t.like(game.board, board(3, [
    ['C', 'fF']
  ]))
})

