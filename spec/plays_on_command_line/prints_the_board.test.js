import test from 'ava'
import Cli from '../../src/players/cli.js'
import Game from '../../src/model/game.js'
import MockInterface from '../mock_interface.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('Empty board', async t => {
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
    '    a   b   c' + '\n'
  ])
})

test.skip('5x5 board', async t => {
  const inter = new MockInterface()
  const cli = new Cli({
    interface: inter
  }, 'Foo')

  const game = new Game(5)

  inter.answer('Your play:', '')
  cli.play(game)

  await inter.expect(
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
    '    a   b   c   d   e' + '\n')

  t.pass()
})

test.skip('Some flats', async t => {
  const inter = new MockInterface()
  const cli = new Cli('Foo', inter)

  const game = new Game()
  game.board.squares['a1'].stack(new Stack([new Stone('white')]))
  game.board.squares['b1'].stack(new Stack([new Stone('black')]))
  game.board.squares['c3'].stack(new Stack([new Stone('white')]))

  inter.answer('Your play:', '')
  cli.play(game)

  await inter.expect(
    '  ,-------------------,' + '\n' +
    '5 |   |   |   |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '4 |   |   |   |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '3 |   |   | F |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '2 |   |   |   |   |   |' + '\n' +
    '  |-------------------|' + '\n' +
    '1 | F | f |   |   |   |' + '\n' +
    "  '-------------------'" + '\n' +
    '    a   b   c   d   e' + '\n')

  t.pass()
})