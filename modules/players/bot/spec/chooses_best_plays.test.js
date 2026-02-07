import test from 'ava'
import { setup_game } from '../../../game/spec/lib/fixture.js'
import Bot from '../src/bot.js'

test('prefer flats', t => {
  const game = setup_game(3, [])

  const bot = new Bot()
  const plays = bot.best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'a1', 'a2', 'a3',
    'b1', 'b2', 'b3',
    'c1', 'c2', 'c3'
  ])
})

test('prefer chains', t => {
  const game = setup_game(3, [
    ['F']
  ])

  const bot = new Bot()
  const plays = bot.best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'a2', 'b3'
  ])
})

test('find road', t => {
  const game = setup_game(3, [
    ['F', 'F']
  ])

  const bot = new Bot()
  const plays = bot.best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c3'
  ])
})

test('prevent road', t => {
  const game = setup_game(3, [
    ['f', 'f']
  ])

  const bot = new Bot()
  const plays = bot.best_plays(game.board, 1)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c3'
  ])
})

test('prevent road with wall', t => {
  const game = setup_game(3, [
    ['ff', '', 'f']
  ])

  const bot = new Bot()
  const plays = bot.best_plays(game.board, 1)

  t.deepEqual(plays.map(p => p.ptn()), [
    'Sb3'
  ])
})

test('find tinue', t => {
  const game = setup_game(3, [
    ['F'],
    [],
    ['', '', 'F']
  ])

  const bot = new Bot()
  const plays = bot.best_plays(game.board, 2)

  t.deepEqual(plays.map(p => p.ptn()), [
    'a1'
  ])
})
