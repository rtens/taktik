import test from 'ava'
import Game from '../../src/model/game.js'
import parse from '../../src/model/parse.js'
import Bot from '../../src/players/bot.js'

test('first play', t => {
  const game = new Game()

  const play = new Bot().play(game)

  t.is(play.comment, 'opening')
})

test('second play', t => {
  const game = played('a1')

  const play = new Bot().play(game)

  t.is(play.comment, 'opening')
})

test('finish road', t => {
  const game = played('a1', 'a2', 'b2', 'a3')

  const play = new Bot().play(game)

  t.assert(play.comment.match(/9250@2 \d+ms \d+\/s/),
    play.comment)
})

test('level 0 does not see tak', t => {
  const game = played('a1', 'a2', 'b2')

  const bot = new Bot()
  bot.level = 0
  const play = bot.play(game)

  t.assert(play.comment.match(/0@0 \d+ms \d+\/s/),
    play.comment)
})

test('timeout', t => {
  const game = played('a1', 'a2', 'b2')

  const bot = new Bot()
  bot.level = 5
  bot.think_time_ms = 10
  const play = bot.play(game)

  t.assert(play.comment.match(/@\d \d+ms \d+\/s TIMEOUT/),
    play.comment)
})

function played(...plays) {
  const game = new Game(3)
  plays.forEach(p => game.perform(parse(p)))
  return game
}

