import test from 'ava'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'
import Runner from '../../src/runner.js'
import { PlaceFlat } from '../../src/model/play.js'
import Board from '../../src/model/board.js'
import Coords from '../../src/model/coords.js'

test('tracks plays', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const plays = []
  class MyPlayer extends MockPlayer {
    play(game) {
      plays.push([...game.plays])
      return super.play(game)
    }
  }

  runner.import = MyPlayer.import()
  runner.random = () => 0
  await runner.run()

  t.like(plays, [
    [],
    [PlaceFlat.at(0, 0)]
  ])
})

test('applies plays', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const applied = []
  class MyPlayer extends MockPlayer {
    play(game) {
      if (game.plays.length < 2) {
        const name = this.name()
        return new class extends PlaceFlat {
          apply(board, color) {
            applied.push([name, board.constructor, color])
            super.apply(board, color)
          }
          ptn() {
            return name + "'s play"
          }
        }(new Coords(game.plays.length, 0))
      }

      return super.play(game)
    }
  }

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  runner.import = MyPlayer.import()
  await runner.run()

  t.like(inter.outputs.slice(1), [
    "One plays One's play",
    "Two plays Two's play"
  ])

  t.like(applied, [
    ['One', Board, 'black'],
    ['One', Board, 'black'],
    ['Two', Board, 'white'],
    ['Two', Board, 'white']
  ])
})

test('white forfeits', async t => {
  const inter = new MockInterface()
  const runner = new Runner(inter)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  runner.import = MockPlayer.playing([]).import()
  await runner.run()

  t.like(inter.outputs.slice(-2), [
    'Two forfeited',
    '0-1'
  ])
})

test('black forfeits', async t => {
  const inter = new MockInterface()
  const runner = new Runner(inter)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  runner.import = MockPlayer.playing(['a1']).import()
  await runner.run()

  t.like(inter.outputs.slice(-2), [
    'One forfeited',
    '1-0'
  ])
})