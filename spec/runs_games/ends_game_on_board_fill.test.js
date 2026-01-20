import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'
import { PlaceFlat } from '../../src/model/play.js'

test('white wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let played = 0
  runner.import = (class extends MockPlayer {
    play(game) {
      played++
      return super.play(game)
    }
  }).import()


  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "One won by flat count",
    "F-0"
  ])
  t.is(played, 9)
})

test('black wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'a1', 'a2', 'b1',
    'c1', 'a3', 'b2',
    'c2', 'b3', 'a3-',
    'a3', 'c3'
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "Two won by flat count",
    "0-F"
  ])
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
  runner.import = (class extends MockPlayer {
    play(game) {
      played++
      return first.length
        ? first.shift()
        : super.play(game)
    }
  }).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "4")

  await runner.run()

  t.is(played, 16)
  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "It's a draw",
    "1/2-1/2"
  ])
})