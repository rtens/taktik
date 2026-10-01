import test from 'ava'
import Bot from '../src/bot.js'
import Game from '../../../game/src/game.js'
import Place from '../../../game/src/place.js'

test('first', async t => {
  const game = new Game(3)
  const bot = new Bot()

  const play = await bot.play(game)
  t.is(play.constructor, Place.Stack)
  t.deepEqual(play, Place.Stack.at(0, 0))
})

test('response to a1', async t => {
  const game = new Game(3)
  const bot = new Bot()
  game.perform(Place.Flat.at(0, 0))

  const play = await bot.play(game)
  t.deepEqual(play, Place.Flat.at(2, 2))
})

test('response to other', async t => {
  const game = new Game(3)
  const bot = new Bot()
  game.perform(Place.Flat.at(0, 2))

  const play = await bot.play(game)
  t.deepEqual(play, Place.Flat.at(0, 0))
})