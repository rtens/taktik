import fs from 'fs'

class Analyzer extends Bot {

  save(board, depth) {
    const analysis = new Analyzer().analyze(board, depth)
    fs.writeFileSync('analysis.json', JSON.stringify(analysis, null, 2))
  }

  analyze(board, depth) {
    this.node = { plays: [] }
    this.branch = []

    const _apply = board.apply
    board.apply = play => {
      const next = {
        turn: board.turn,
        play: play.ptn(),
        alpha: null,
        beta: null,
        score: null,
        plays: []
      }

      this.node.plays.push(next)
      this.branch.push(this.node)
      this.node = next

      return _apply.call(board, play)
    }

    const _revert = board.revert
    board.revert = play => {
      this.node = this.branch.pop()

      return _revert.call(board, play)
    }

    super.best_plays(board, depth)

    return this.node.plays
  }

  search(board, depth, alpha, beta) {
    this.node.alpha = alpha
    this.node.beta = beta
    const score = super.search(board, depth, alpha, beta)
    this.node.score = -score
    return score
  }
}
