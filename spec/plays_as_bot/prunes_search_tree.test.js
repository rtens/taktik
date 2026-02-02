import test from 'ava'
import Bot from '../../src/players/bot.js'
import Board from '../../src/model/board.js'

test('without pruning', t => {
  const board = new Board(3)
  board.white.take_flat()
  board.black.take_flat()

  const bot = new MyBot(false, 2)
  bot.best_play(board)

  t.deepEqual(bot.searched, {
    0: 18,
    1: 306,
    2: 5058,
  })
})

test('with pruning', t => {
  const board = new Board(3)
  board.white.take_flat()
  board.black.take_flat()

  const bot = new MyBot(true, 3)
  bot.random = () => 0
  bot.best_play(board)

  t.deepEqual(bot.searched, {
    0: 18,
    1: 306,
    2: 1230,
    3: 7655
  })
})

class MyBot extends Bot {
  searched = {}

  constructor(pruning, level) {
    super(null, level)
    this.pruning = pruning
  }
  best_plays(board, depth, sorted) {
    return super.best_plays(board, depth, sorted)
  }

  search(board, depth, alpha, beta) {
    this.searched[this.level - depth] ||= 0
    this.searched[this.level - depth]++
    return super.search(board, depth, alpha, beta)
  }
}
