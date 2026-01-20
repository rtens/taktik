import test from 'ava'
import Runner from '../../src/runner.js'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'

test('default size', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let size
  class MyPlayer extends MockPlayer {
    play(game) {
      size = game.board.size
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.next()

  t.is(size, 5)
})

test('chosen size', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let size
  class MyPlayer extends MockPlayer {
    play(game) {
      size = game.board.size
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "4")
  await inter.next()

  t.is(size, 4)
})

test('invalid size', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let size
  class MyPlayer extends MockPlayer {
    play(game) {
      size = game.board.size
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "foo")
  await inter.next()

  t.is(size, 5)
})

test('minimum size is 3', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let size
  class MyPlayer extends MockPlayer {
    play(game) {
      size = game.board.size
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "2")
  await inter.next()

  t.is(size, 3)
})

test('maximum size is 8', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let size
  class MyPlayer extends MockPlayer {
    play(game) {
      size = game.board.size
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "9")
  await inter.next()

  t.is(size, 8)
})