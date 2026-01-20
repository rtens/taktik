import test from 'ava'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'
import Runner from '../../src/runner.js'
import Player from '../../src/player.js'
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
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.next()

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

  runner.import = MyPlayer.import()
  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "")
  await inter.expect("One plays One's play")
  await inter.expect("Two plays Two's play")
  await inter.next()

  t.like(applied, [
    ['One', Board, 'black'],
    ['One', Board, 'black'],
    ['Two', Board, 'white'],
    ['Two', Board, 'white']
  ])
})