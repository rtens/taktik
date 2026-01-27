import test from 'ava'
import Bot from '../../src/players/bot.js'
import Game from '../../src/model/game.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'
import parse from '../../src/model/parse.js'

test('limited time', t => {
  const game = new Game(3)

  const bot = new Bot().at(4)
  bot.think_time_ms = 100

  const start = new Date().getTime()
  const play = bot.best_play(game.board)
  const time = new Date().getTime() - start

  t.assert(time < 120, 'Took ' + time + 'ms')
  t.assert(play != null)
})

test('finishes road', t => {
  const game = new Game(3)
  game.perform(parse('b1'))
  game.perform(parse('a3'))

  game.board.squares['a3'].stack(new Stack([new Stone('white')]))
  game.board.squares['b3'].stack(new Stack([new Stone('white')]))
  game.board.squares['b1'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black'),
  ]))
  game.board.squares['c1'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black'),
  ]))
  game.board.squares['c2'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black'),
  ]))

  const bot = new Bot().at(4)
  bot.think_time_ms = 100
  bot.random = () => 0

  const play = bot.best_play(game.board)

  t.is(play.ptn(), 'c3')
})

test('prevents road', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a3'))
  game.perform(parse('c3'))

  const bot = new Bot().at(4)
  bot.think_time_ms = 100
  bot.random = () => 0
  const play = bot.best_play(game.board)

  t.is(play.ptn(), 'b3')
})