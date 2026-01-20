import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'
import { PlaceFlat } from '../../src/model/play.js'
import Board from '../../src/model/board.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('white wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing_ptn([
    'b2', 'a1', 'a2', 'b3', 'a3'
  ]).import()

  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "3")
  await inter.expect("One won by road")
  await inter.expect("R-0")

  t.pass()
})

test('black wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing_ptn([
    'a1', 'b1', 'b2', 'a2', 'c3', 'a3'
  ]).import()

  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "3")
  await inter.expect("Two won by road")
  await inter.expect("0-R")

  t.pass()
})

test('snake', t => {
  const board = new Board(4)

  const road = ['b1', 'b2', 'c2', 'c3', 'd3', 'd4']

  road.forEach(c =>
    board.squares[c]
      .stack(new Stack([new Stone('white')])))

  t.deepEqual(board.road().map(s => s.coords.name()),
    road)
})