import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'
import Board from '../../src/model/board.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test.only('white wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'b2', 'a1', 'a2', 'b3', 'a3'
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.deepEqual(inter.outputs.slice(-2), [
    "One won by road",
    "R-0",
  ])
})

test('black wins', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'a1', 'b1', 'b2', 'a2', 'c3', 'a3'
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "Two won by road",
    "0-R",
  ])

  t.pass()
})

test('road with board fill', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'a1', 'b1', 'c1', 'b2', 'a2', 'a3',
    'b3', 'c3', 'b1<', 'c2', 'b1'
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "One won by road",
    "R-0",
  ])

  t.pass()
})

test('no road', t => {
  const board = new Board(4)

  t.deepEqual(board.road('white'), null)
})

test('white snake', t => {
  const board = new Board(4)

  const road = ['b1', 'b2', 'c2', 'c3', 'd3', 'd4']

  road.forEach(c =>
    board.squares[c]
      .stack(new Stack([new Stone('white')])))

  t.deepEqual(board.road('white')
    .map(s => s.coords.name),
    road)
})