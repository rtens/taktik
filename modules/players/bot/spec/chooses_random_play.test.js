import test from 'ava'
import Bot from '../src/bot.js'
import Game from '../../../game/src/game.js'
import Place from '../../../game/src/place.js'

test('random play', async t => {
  const game = new Game(3)
  const bot = new Bot()
  const plays = []

  bot.random = () => 0.1
  plays.push(await bot.play(game))
  bot.random = () => 0.9
  plays.push(await bot.play(game))

  t.deepEqual(plays, [
    Place.Flat.at(0, 0),
    Place.Flat.at(2, 2),
  ])
})