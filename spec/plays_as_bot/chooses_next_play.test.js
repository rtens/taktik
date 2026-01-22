import test from 'ava'
import Game from '../../src/model/game.js'
import parse from '../../src/model/parse.js'
import Bot from '../../src/players/bot.js'

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

test('choses random play', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))

  const bot = new Bot()
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'a2+')
})
