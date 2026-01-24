import test from 'ava'
import Bot from '../../src/players/bot.js'
import Board from '../../src/model/board.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('limited time', t => {
  const board = new Board(3)

  const bot = new Bot().at(4)
  bot.think_time_ms = 100
  bot.random = () => 0

  const start = new Date().getTime()
  bot.best_play(board, 'white')
  const time = new Date().getTime() - start

  t.assert(time < 110)
})

test('finishes road', t => {
  const board = new Board(3)
  board.squares['a3'].stack(new Stack([new Stone('white')]))
  board.squares['b3'].stack(new Stack([new Stone('white')]))
  board.squares['b1'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black'),
  ]))
  board.squares['c1'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black'),
  ]))
  board.squares['c2'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black'),
  ]))

  const bot = new Bot().at(4)
  bot.think_time_ms = 100
  bot.random = () => 0

  const play = bot.best_play(board, 'white')

  t.is(play.ptn(), 'c3')
})

test('prevents road', t => {
  const board = new Board(3)
  board.squares['a3'].stack(new Stack([new Stone('white')]))
  board.squares['c3'].stack(new Stack([new Stone('white')]))

  const bot = new Bot().at(3)
  bot.think_time_ms = 100
  bot.random = () => 0
  const play = bot.best_play(board, 'black')

  t.is(play.ptn(), 'b3')
})