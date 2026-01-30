import parse from '../model/parse.js'
import Player from '../player.js'

export default class Cli extends Player {

  constructor(runner, name) {
    super(runner)
    this.name = () => name
  }

  async play(game) {
    let input = await this.runner.interface.read('Your play:')

    while (typeof input == 'string') {
      if (input) return parse(input)

      this.runner.interface.print(game.board.print(this.runner.paint))
      input = await this.runner.interface.read('Your play:')
    }
  }
}