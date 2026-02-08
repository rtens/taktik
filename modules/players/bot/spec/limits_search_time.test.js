import test from 'ava'
import Bot from '../src/bot.js'
import Game from '../../../game/src/game.js'

test('timeout', async t => {
  const bot = new Bot()
  bot.level = 3
  bot.time = 100

  const start = new Date().getTime()
  await bot.best(new Game(5).board)
  const time = new Date().getTime() - start

  t.assert(time < 110, 'took ' + time)
})
