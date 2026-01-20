import Coords from '../model/coords.js'
import { Capstone, Stone } from '../model/piece.js'
import { parse } from '../model/play.js'
import Player from '../player.js'

export default class Cli extends Player {

  constructor(runner, name) {
    super(runner)
    this.name = () => name
  }

  async start() {
    this.runner.interface.print('Press enter to see the board')
  }

  async play(game) {
    let input = await this.runner.interface.read('Your play:')

    while (typeof input == 'string') {
      if (input) return parse(input)

      this.print_board(game.board)
      input = await this.runner.interface.read('Your play:')
    }
  }

  print_board(board) {
    const repeat = v => [...Array(board.size)].map(() => v)
    let lines = ['  ,' + repeat('---').join('-') + ',']

    const stacks = []
    for (let r = 0; r < board.size; r++) {
      stacks.push([])
      for (let f = 0; f < board.size; f++) {
        stacks[r].push(board.square(new Coords(f, r)).pieces)
      }
    }

    const rows = []
    for (let r = board.size - 1; r >= 0; r--) {
      const max = Math.max(1, ...stacks[r].map(s => s.length))

      for (let l = max - 1; l >= 0; l--) {
        const row = []
        for (const stack of stacks[r]) {
          let p = ' '
          const piece = stack[l]

          if (piece) {
            if (piece instanceof Stone) {
              p = piece.standing ? 's' : 'f'
            } else if (piece instanceof Capstone) {
              p = 'c'
            }

            if (piece.color == 'white') {
              p = p.toUpperCase()
            }
          }

          row.push(' ' + p + ' ')
        }
        rows.push((r + 1) + ' |' + row.join('|') + '|')
      }
      rows.push('  |' + repeat('---').join('-') + '|')
    }

    lines.push(...rows.slice(0, -1))
    lines.push("  '" + repeat('---').join('-') + "'")
    lines.push('   ' + [...Array(board.size).keys()]
      .map(i => ' ' + String.fromCharCode(97 + i) + ' ').join(' '))

    this.runner.interface.print(lines.join('\n'))
  }
}