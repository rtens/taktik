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

  t.like(bot.debug[0], {
    searched: {
      2: 18,
      1: 306,
      0: 5058,
    }
  })
})

test('with pruning', t => {
  const board = new Board(3)

  const bot = new Bot().at(3)
  bot.think_time_ms = 1000
  bot.random = () => 0
  bot.best_play(board, 'white')

  t.like(bot.debug[0], {
    searched: {
      3: 18,
      2: 51,
      1: 352,
      0: 4628,
    }
  })
})