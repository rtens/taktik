import test from 'ava'
import Bot from '../../src/players/bot.js'
import Board from '../../src/model/board.js'

test('without pruning', t => {
  const board = new Board(3)

  const bot = new Bot().at(2)
  bot.think_time_ms = 1000
  bot.random = () => 0
  bot.pruning = false
  bot.best_play(board, 'white')

  t.deepEqual(bot.debug[0].searched[2], {
    2: 18,
    1: 288,
    0: 4752
  })
})

test('with pruning', t => {
  const board = new Board(3)

  const bot = new Bot().at(2)
  bot.think_time_ms = 1000
  bot.random = () => 0
  bot.best_play(board, 'white')

  t.is(bot.debug[0].searched[2][2], 18)
  t.assert(bot.debug[0].searched[2][1] < 288)
  t.assert(bot.debug[0].searched[2][0] < 4752)
})