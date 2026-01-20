import test from 'ava'
import Runner from '../../src/runner.js'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'

test('default size', async t => {
  const inter = new MockInterface(t)

  inter.answer("Board size: (3-8 [5])", "")
  const size = await run(inter)

  t.is(size, 5)
})

test('chosen size', async t => {
  const inter = new MockInterface(t)

  inter.answer("Board size: (3-8 [5])", "4")
  const size = await run(inter)

  t.is(size, 4)
})

test('invalid size', async t => {
  const inter = new MockInterface(t)

  inter.answer("Board size: (3-8 [5])", "foo")
  const size = await run(inter)

  t.is(size, 5)
})

test('minimum size is 3', async t => {
  const inter = new MockInterface(t)

  inter.answer("Board size: (3-8 [5])", "2")
  const size = await run(inter)

  t.is(size, 3)
})

test('maximum size is 8', async t => {
  const inter = new MockInterface(t)

  inter.answer("Board size: (3-8 [5])", "9")
  const size = await run(inter)

  t.is(size, 8)
})

async function run(inter) {
  const runner = new Runner(inter)

  let size
  class MyPlayer extends MockPlayer {
    play(game) {
      size = game.board.size
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  await runner.run()

  return size
}
