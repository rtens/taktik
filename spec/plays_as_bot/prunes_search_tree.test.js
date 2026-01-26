import test from 'ava'
import Bot from '../../src/players/bot.js'
import Board from '../../src/model/board.js'

test('without pruning', t => {
  const bot = new MyBot(false, 2)
  bot.best_play(new Board(3))

  t.deepEqual(bot.searched, {
    0: 18,
    1: 336,
    2: 5520,
  })
})

test('with pruning', t => {
  const bot = new MyBot(true, 3)
  bot.best_play(new Board(3))

  t.deepEqual(bot.searched, {
    0: 18,
    1: 336,
    2: 572,
    3: 5984,
  })
})

class MyBot extends Bot {
  searched = {}

  constructor(pruning, level) {
    super(null, level)
    this.pruning = pruning
  }
  best_plays(board, depth) {
    if (depth < this.level) return []
    return super.best_plays(board, depth)
  }

  search(board, depth, alpha, beta) {
    this.searched[this.level - depth] ||= 0
    this.searched[this.level - depth]++
    return super.search(board, depth, alpha, beta)
  }
}