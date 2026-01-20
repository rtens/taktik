import test from 'ava'
import Cli from '../../src/players/cli.js'
import Game from '../../src/model/game.js'
import MockInterface from '../mock_interface.js'
import Stack from '../../src/model/stack.js'
import { Capstone, Stone } from '../../src/model/piece.js'

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
    '3 |   |   |   |' + '\n' +
    '  |-----------|' + '\n' +
    '2 |   |   |   |' + '\n' +
    '  |-----------|' + '\n' +
    '1 |   |   |   |' + '\n' +
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
    '5 |   |   |   |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '4 |   |   |   |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '3 |   |   |   |   |   |' + '\n' +
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

  const game = new Game(3)
  game.board.squares['a1'].stack(new Stack([new Stone('white')]))
  game.board.squares['b1'].stack(new Stack([new Stone('black')]))
  game.board.squares['c3'].stack(new Stack([new Stone('white')]))
  game.board.squares['c1'].stack(new Stack([new Stone('white').stand()]))
  game.board.squares['c2'].stack(new Stack([new Stone('black').stand()]))
  game.board.squares['a3'].stack(new Stack([new Capstone('black')]))
  game.board.squares['b3'].stack(new Stack([new Capstone('white')]))

  inter.answer('Your play:', '')
  await cli.play(game)

  t.like(inter.outputs, [
    '  ,-----------,' + '\n' +
    '3 | c | C | F |' + '\n' +
    '  |-----------|' + '\n' +
    '2 |   |   | s |' + '\n' +
    '  |-----------|' + '\n' +
    '1 | F | f | S |' + '\n' +
    "  '-----------'" + '\n' +
    '    a   b   c '])
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
    new Capstone('white')
  ]))
  game.board.squares['b2'].stack(new Stack([
    new Stone('black'),
    new Stone('white')
  ]))

  inter.answer('Your play:', '')
  await cli.play(game)

  t.like(inter.outputs, [
    '  ,-----------,' + '\n' +
    '3 |   |   |   |' + '\n' +
    '  |-----------|' + '\n' +
    '2 |   | F |   |' + '\n' +
    '2 |   | f |   |' + '\n' +
    '  |-----------|' + '\n' +
    '1 | S |   |   |' + '\n' +
    '1 | f |   | C |' + '\n' +
    '1 | F |   | f |' + '\n' +
    "  '-----------'" + '\n' +
    '    a   b   c '])
})