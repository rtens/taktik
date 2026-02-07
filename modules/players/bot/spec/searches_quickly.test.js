import test from 'ava'
import { setup_game } from '../../../game/spec/lib/fixture.js'
import Bot from '../src/bot.js'
import crypto from 'crypto'

test('empty board', t => {
  const start_benchmark = new Date().getTime()
  for (let i = 0; i < 100000; i++)
    crypto.randomBytes(32).toString('base64')
  const end_benchmark = new Date().getTime()
  const benchmark = end_benchmark - start_benchmark

  const game = setup_game(3, [])

  class MyBot extends Bot {
    searched = 0
    search(board, depth, alpha, beta) {
      this.searched++
      return super.search(board, depth, alpha, beta)
    }
  }

  const bot = new MyBot()

  const start = new Date().getTime()
  bot.best_plays(game.board, 3)
  const end = new Date().getTime()

  const per_benchmark = Math.round(bot.searched / (end - start) * benchmark)

  t.is(per_benchmark > 20000, true, per_benchmark.toString())
})
