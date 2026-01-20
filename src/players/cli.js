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
    const input = await this.runner.interface.read('Your play:')
    if (input) return parse(input)

    this.print_board(game.board)
    return this.play(game)
  }

  print_board(board) {
    this.runner.interface.print(
      '  ,-----------,' + '\n' +
      '3 |   |   |   |' + '\n' +
      '  |-----------|' + '\n' +
      '2 |   |   |   |' + '\n' +
      '  |-----------|' + '\n' +
      '1 |   |   |   |' + '\n' +
      "  '-----------'" + '\n' +
      '    a   b   c' + '\n')
  }
}