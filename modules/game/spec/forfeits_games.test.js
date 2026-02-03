import test from 'ava'
import Game from '../src/game.js'
import { Forfeit } from '../src/result.js'

test('white forfeits', t => {
  const game = new Game(3)

  game.forfeit()

  t.deepEqual(game.result(), new Forfeit('white'))
  t.is(game.result().color, 'black')
})

test('black forfeits', t => {
  const game = new Game(3)
  game.board.turn = 'black'

  game.forfeit()

  t.deepEqual(game.result(), new Forfeit('black'))
  t.is(game.result().color, 'white')
})
