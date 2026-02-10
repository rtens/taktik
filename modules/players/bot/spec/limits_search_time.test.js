import test from 'ava'
import Bot from '../src/bot.js'
import { setup_game } from '../../../game/spec/lib/fixture.js'
import Game from '../../../game/src/game.js'

test('timeout', async t => {
  const bot = new Bot()
  bot.level = 3
  bot.time = 50

  const start = new Date().getTime()
  await bot.best(new Game(5).board)
  const time = new Date().getTime() - start

  t.assert(time < 70, 'took ' + time)
})

test('prevent road', async t => {
  const game = setup_game(3, [
    ['', 'f', 'f'],
  ])

  const bot = new class extends Bot {
    search(board, depth, alpha, beta, timeout) {
      return super.search(board, depth, alpha, beta, timeout)
    }
  }
  bot.level = 3
  bot.time = 10

  const play = await bot.best(game.board)

  t.is(play.ptn(), 'a3')
})
