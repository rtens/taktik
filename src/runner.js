import Game from './model/game.js'
import { Draw, FlatWin, Forfeit, RoadWin } from './model/result.js'

export default class Runner {

  constructor(inter) {
    this.interface = inter
    this.import = file => import(file)
    this.random = Math.random
  }

  async run() {
    this.interface.print("Let's play Tak")

    const [white, black] = await this.players()
    const players = { white, black }

    const size_input = await this.interface.read('Board size: (3-8 [5])')
    const size = Math.max(3, Math.min(8, parseInt(size_input) || 5))
    const game = new Game(size)

    while (!game.result()) {
      const player = players[game.turn()]

      const play = await player.play(game)

      if (play) {
        game.perform(play)
        this.interface.print(`${player.name()} plays ${play.ptn()}`)

      } else {
        game.forfeit(game.turn())
      }
    }

    const result = game.result()
    if (result instanceof RoadWin) {
      this.interface.print(`${players[result.color].name()} won by road`)
    } else if (result instanceof FlatWin) {
      this.interface.print(`${players[result.color].name()} won by flat count`)
    } else if (result instanceof Draw) {
      this.interface.print("It's a draw")
    } else if (result instanceof Forfeit) {
      this.interface.print(`${players[result.color].name()} forfeited`)
    }
    this.interface.print(result.ptn())
  }

  async players() {
    const player1 = await this.load_player('Player 1:')
    const player2 = await this.load_player('Player 2:')

    const start = await this.interface.read('Who is white? (1, 2, [r]andom)')

    if (start == '1') {
      return [player1, player2]
    } else if (start == '2') {
      return [player2, player1]
    } else if (this.random() < .5) {
      return [player1, player2]
    } else {
      return [player2, player1]
    }
  }

  async load_player(prompt) {
    const input = await this.interface.read(prompt)
    const [name, ...args] = input.split(' ')
    const { default: LoadedPlayer } = await this.import(`./players/${name}.js`)
    return new LoadedPlayer(this, ...args)
  }
}