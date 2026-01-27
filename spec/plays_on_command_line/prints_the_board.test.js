import test from 'ava'
import Cli from '../../src/players/cli.js'
import Game from '../../src/model/game.js'
import MockInterface from '../mock_interface.js'
import Stack from '../../src/model/stack.js'
import { Cap, Stone } from '../../src/model/piece.js'
import parse from '../../src/model/parse.js'

test('empty board', async t => {
  const inter = new MockInterface()
  const cli = new Cli({
    interface: inter
  }, 'Foo')

  const game = new Game(3)

  inter.answer('Your play:', '')
  await cli.play(game)

  t.like(inter.outputs, [
    '  ,-----------,' + '\n' +
    '3 |   |   |   |   C: 0' + '\n' +
    '  |-----------|   S: 10' + '\n' +
    '2 |   |   |   |' + '\n' +
    '  |-----------|   c: 0' + '\n' +
    '1 |   |   |   |   s: 10' + '\n' +
    "  '-----------'" + '\n' +
    '    a   b   c '
  ])
})

test('larger board', async t => {
  const inter = new MockInterface()
  const cli = new Cli({
    interface: inter
  }, 'Foo')

  const game = new Game(5)

  inter.answer('Your play:', '')
  await cli.play(game)

  t.like(inter.outputs, [
    '  ,-------------------,' + '\n' +
    '5 |   |   |   |   |   |   C: 1' + '\n' +
    '  |-------------------|   S: 21' + '\n' +
    '4 |   |   |   |   |   |' + '\n' +
    '  |-------------------|   c: 1' + '\n' +
    '3 |   |   |   |   |   |   s: 21' + '\n' +
    '  |-------------------|' + '\n' +
    '2 |   |   |   |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '1 |   |   |   |   |   |' + '\n' +
    "  '-------------------'" + '\n' +
    '    a   b   c   d   e '
  ])
})

test('different pieces', async t => {
  const inter = new MockInterface()
  const cli = new Cli({
    interface: inter
  }, 'Foo')

  const game = new Game(5)
  game.perform(parse('b1'))
  game.perform(parse('a1'))
  game.perform(parse('c3'))
  game.perform(parse('Sc2'))
  game.perform(parse('Sc1'))
  game.perform(parse('Cb3'))
  game.perform(parse('Ca3'))

  inter.answer('Your play:', '')
  await cli.play(game)

  t.like(inter.outputs, [
    '  ,-------------------,' + '\n' +
    '5 |   |   |   |   |   |   C: 0' + '\n' +
    '  |-------------------|   S: 18' + '\n' +
    '4 |   |   |   |   |   |' + '\n' +
    '  |-------------------|   c: 0' + '\n' +
    '3 | C | c | F |   |   |   s: 19' + '\n' +
    '  |-------------------|' + '\n' +
    '2 |   |   | s |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '1 | F | f | S |   |   |' + '\n' +
    "  '-------------------'" + '\n' +
    '    a   b   c   d   e '
  ])
})

test('stacks', async t => {
  const inter = new MockInterface()
  const cli = new Cli({
    interface: inter
  }, 'Foo')

  const game = new Game(3)
  game.board.squares['a1'].stack(new Stack([
    new Stone('white'),
    new Stone('black'),
    new Stone('white').stand(),
  ]))
  game.board.squares['c1'].stack(new Stack([
    new Stone('black'),
    new Cap('white')
  ]))
  game.board.squares['b2'].stack(new Stack([
    new Stone('black'),
    new Stone('white')
  ]))

  inter.answer('Your play:', '')
  await cli.play(game)

  t.like(inter.outputs, [
    '  ,-----------,' + '\n' +
    '3 |   |   |   |   C: 0' + '\n' +
    '  |-----------|   S: 10' + '\n' +
    '2 |   | F |   |' + '\n' +
    '2 |   | f |   |   c: 0' + '\n' +
    '  |-----------|   s: 10' + '\n' +
    '1 | S |   |   |' + '\n' +
    '1 | f |   | C |' + '\n' +
    '1 | F |   | f |' + '\n' +
    "  '-----------'" + '\n' +
    '    a   b   c '])
})