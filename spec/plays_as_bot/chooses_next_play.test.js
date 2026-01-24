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

test('prefers flats as white', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))

  const bot = new Bot().at(0)
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'a3')
})

test('prefers flats as black', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('a3'))

  const bot = new Bot().at(0)
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'b1')
})

test('finishes white roads', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('b2'))
  game.perform(parse('a3'))

  const bot = new Bot().at(0)
  const play = bot.play(game)

  t.is(play.ptn(), 'c2')
})

test('does not prevent roads at level 0', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('b2'))

  const bot = new Bot().at(0)
  bot.random = () => 0
  const play = bot.play(game)

  t.is(play.ptn(), 'a3')
})

test('prevents roads at level 1', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('a2'))
  game.perform(parse('b2'))

  const bot = new Bot().at(1)
  const play = bot.play(game)

  t.is(play.ptn(), 'c2')
})