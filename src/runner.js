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

    const players = await this.players()
    const game = await this.start_game()

    while (!game.result()) {
      const player = players[game.turn()]
      this.interface.print(`${player.name()}'s turn`)

      const play = await player.play(game.clone())

      if (!play) {
        game.forfeit(game.turn())

      } else {
        this.interface.print(`${player.name()} plays ${play.ptn()}`)

        try {
          game.perform(play)
        } catch (e) {
          this.interface.print('Illegal play: ' + e.message)
        }
      }
    }

    this.print_result(game, players)
    this.interface.close()
  }

  async players() {
    const player1 = await this.load_player('Player 1:')
    const player2 = await this.load_player('Player 2:')

    const start = await this.interface.read('Who is white? (1, 2, [r]andom)')

    if (start == '1') {
      return { white: player1, black: player2 }

    } else if (start == '2') {
      return { white: player2, black: player1 }

    } else if (this.random() < .5) {
      return { white: player1, black: player2 }

    } else {
      return { white: player2, black: player1 }
    }
  }

  async load_player(prompt) {
    const input = await this.interface.read(prompt)
    const [name, ...args] = input.split(' ')
    const { default: LoadedPlayer } = await this.import(`./players/${name}.js`)
    return new LoadedPlayer(this, ...args)
  }

  async start_game() {
    const size_input = await this.interface.read('Board size: (3-8 [5])')
    const size = Math.max(3, Math.min(8, parseInt(size_input) || 5))
    const game = new Game(size)
    return game
  }

  print_result(game, players) {
    const result = game.result()
    if (result instanceof RoadWin) {
      this.interface.print(`${players[result.color].name()} won by road`)
    } else if (result instanceof FlatWin) {
      this.interface.print(`${players[result.color].name()} won by flat count`)
    } else if (result instanceof Draw) {
      this.interface.print("It's a draw")
    } else if (result instanceof Forfeit) {
      this.interface.print(`${players[result.color].name()} forfeits`)
    }
    this.interface.print(result.ptn())
  }
}