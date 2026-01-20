import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'

test('player 1 starts', async t => {
  const inter = new MockInterface(t)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  const played = await run(inter)

  t.like(played, ['One', 'Two'])
})

test('player 2 starts', async t => {
  const inter = new MockInterface(t)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "2")

  const played = await run(inter)

  t.like(played, ['Two', 'One'])
})

test('player 1 starts randomly', async t => {
  const inter = new MockInterface(t)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "")

  const played = await run(inter, runner =>
    runner.random = () => .4)

  t.like(played, ['One', 'Two'])
})

test('player 2 starts randomly', async t => {
  const inter = new MockInterface(t)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "r")

  const played = await run(inter, runner =>
    runner.random = () => .5)

  t.like(played, ['Two', 'One'])
})

async function run(inter, first = () => null) {
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
  await runner.run()

  return played
}

