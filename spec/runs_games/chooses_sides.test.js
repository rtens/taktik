import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'

test('player 1 starts', async t => {
  const inter = new MockInterface(t)

  const played = run(inter)

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.next()

  t.like(played, ['One', 'Two'])
})

test('player 2 starts', async t => {
  const inter = new MockInterface(t)

  const played = run(inter)

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "2")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.next()

  t.like(played, ['Two', 'One'])
})

test('player 1 starts randomly', async t => {
  const inter = new MockInterface(t)

  const played = run(inter, runner =>
    runner.random = () => .4)

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.next()

  t.like(played, ['One', 'Two'])
})

test('player 2 starts randomly', async t => {
  const inter = new MockInterface(t)

  const played = run(inter, runner =>
    runner.random = () => .5)

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "r")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.next()

  t.like(played, ['Two', 'One'])
})

function run(inter, first = () => null) {
  const runner = new Runner(inter)

  class MyPlayer extends MockPlayer {
    play(game) {
      played.push(this.name())
      return super.play(game)
    }
  }

  const played = []
  runner.import = MyPlayer.import()

  first(runner)
  runner.run()

  return played
}

