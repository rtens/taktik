import test from 'ava'
import Game from '../../src/model/game.js'
import parse from '../../src/model/parse.js'
import Bot from '../../src/players/bot.js'
import Board from '../../src/model/board.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('first play', t => {
  const game = new Game()
  const play = new Bot().play(game)

  t.is(play.ptn(), 'a1')
})

test('second play', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  const play = new Bot().play(game)

  t.is(play.ptn(), 'c3')
})

test('prefers flats as white', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))

  const bot = new Bot().at(0)
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'a3')
})

test('prefers flats as black', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('a3'))

  const bot = new Bot().at(0)
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'b1')
})

test('finishes white roads', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('b2'))
  game.perform(parse('a3'))

  const bot = new Bot().at(0)
  const play = bot.play(game)

  t.is(play.ptn(), 'c2')
})

test('does not prevent roads at level 0', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('b2'))

  const bot = new Bot().at(0)
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'a3')
})

test('prevent white road', t => {
  const board = new Board(3)
  board.squares['a1'].stack(new Stack([new Stone('white')]))
  board.squares['b1'].stack(new Stack([new Stone('white')]))

  const bot = new Bot().at(1)
  bot.think_time_ms = 1000
  bot.random = () => 0

  const play = bot.best_play(board, 'black')

  t.is(play.ptn(), 'c1')
})

test.skip('prevent other white road', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('c3'))
  game.perform(parse('a2'))
  game.perform(parse('a3'))
  game.perform(parse('a2+'))

  const bot = new Bot().at(1)
  const play = bot.play(game)

  console.log(bot.debug[0].evals)
  t.is(play.ptn(), 'b3')
})

test('prevent black road', t => {
  const board = new Board(3)
  board.squares['a2'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black')
  ]))

  const bot = new Bot().at(1)
  bot.think_time_ms = 1000
  bot.random = () => 0

  const play = bot.best_play(board, 'white')

  t.is(play.ptn(), 'Sb2')
})

test('white prefers the sooner road', t => {
  const board = new Board(3)
  board.squares['a3'].stack(new Stack([new Stone('white')]))
  board.squares['b3'].stack(new Stack([new Stone('white')]))

  const bot = new Bot().at(2)
  bot.think_time_ms = 10000
  bot.random = () => 0

  const play = bot.best_play(board, 'white')

  t.is(play.ptn(), 'c3')
})

test('black prefers the sooner road', t => {
  const board = new Board(3)
  board.squares['a3'].stack(new Stack([new Stone('white')]))
  board.squares['b3'].stack(new Stack([new Stone('white')]))

  const bot = new Bot().at(1)
  bot.think_time_ms = 1000
  bot.random = () => 0

  const play = bot.best_play(board, 'white')

  t.is(play.ptn(), 'c3')
})