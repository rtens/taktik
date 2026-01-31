import test from 'ava'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'
import Runner from '../../src/runner.js'
import Place from '../../src/model/place.js'
import Board from '../../src/model/board.js'
import { Cap } from '../../src/model/piece.js'
import Coords from '../../src/model/coords.js'
import parse from '../../src/model/parse.js'

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
    [Place.Flat.at(0, 0)]
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
        return new class extends Place.Flat {
          apply(board) {
            applied.push([name, board.constructor, board.turn])
            super.apply(board)
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

  t.like(inter.outputs.slice(2), [
    "One's turn (white)",
    "One plays One's play",
    "Two's turn (black)",
    "Two plays Two's play"
  ])

  t.like(applied, [
    ['One', Board, 'white'],
    ['Two', Board, 'black'],
  ])
})

test('clones game', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  let end
  class MyPlayer extends MockPlayer {
    play(game) {
      if (game.plays.length == 0) {
        game.perform(parse('a5'))
        game.board.white.caps = 'stolen'
        return parse('a1')
      } else if (game.plays.length == 1) {
        game.plays = []
        game.board.squares['a1'].top().stand()
        game.board.squares['a1'].top().color = 'rainbow'
        return parse('e5')
      } else {
        end = game
      }
    }
  }

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  runner.import = MyPlayer.import()
  await runner.run()

  t.like(end, {
    plays: [
      parse('a1'),
      parse('e5'),
    ],
    board: {
      white: {
        caps: [new Cap('white')]
      },
      squares: {
        a1: {
          pieces: [{
            standing: false,
            color: 'black'
          }]
        },
        a5: {
          pieces: []
        }
      }
    }
  })
})

test('white forfeits', async t => {
  const inter = new MockInterface()
  const runner = new Runner(inter)

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  runner.import = MockPlayer.playing([]).import()
  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    'One forfeits',
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

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    'Two forfeits',
    '1-0'
  ])
})

test('hide comments', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  class MyPlayer extends MockPlayer {
    play(game) {
      return super.play(game)
        .commented('Comment by ' + this.name())
    }
  }

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")

  runner.import = MyPlayer.import()
  await runner.run()

  t.like(inter.outputs.slice(2), [
    "One's turn (white)",
    "One plays a1",
    "Two's turn (black)",
    "Two plays b1",
    "One's turn (white)",
  ])
})
