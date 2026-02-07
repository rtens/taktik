import test from 'ava'
import { setup_game } from '../../../game/spec/lib/fixture.js'
import Bot from '../src/bot.js'

test('empty board', t => {
  const game = setup_game(3, [])

  class MyBot extends Bot {
    searched = 0
    evaluated = 0
    search(board, depth, alpha, beta) {
      this.searched++
      return super.search(board, depth, alpha, beta)
    }
    evaluate(board) {
      this.evaluated++
      return super.evaluate(board)
    }
  }

  const bot = new MyBot()
  bot.best_plays(game.board, 3)

  t.is(bot.searched, 7583)
  t.is(bot.evaluated, 6528)
})
