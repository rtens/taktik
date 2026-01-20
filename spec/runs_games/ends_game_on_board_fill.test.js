import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'
import { PlaceFlat } from '../../src/model/play.js'

test('white wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let played = 0
  class MyPlayer extends MockPlayer {
    play(game) {
      played++
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()

  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "3")
  await inter.expect("One won by flat count")
  await inter.expect("F-0")

  t.is(played, 9)
})

test('black wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing_ptn([
    'a1', 'a2', 'b1',
    'c1', 'a3', 'b2',
    'c2', 'b3', 'a3-',
    'a3', 'c3'
  ]).import()

  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "3")
  await inter.expect("Two won by flat count")
  await inter.expect("0-F")

  t.pass()
})

test('draw', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const first = [
    PlaceFlat.at(0, 0),
    PlaceFlat.at(1, 0),
    PlaceFlat.at(3, 0),
    PlaceFlat.at(2, 0),
  ]
  let played = 0
  class MyPlayer extends MockPlayer {
    play(game) {
      played++
      if (game.plays.length < 4) {
        return first.shift()
      }
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "4")
  await inter.expect("It's a draw")
  await inter.expect("1/2-1/2")

  t.is(played, 16)
})