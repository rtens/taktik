import Game from '../../game/src/game.js'

export default class Moderator {

  constructor(user) {
    this.user = user
    this.import = file => import(file)
    this.random = Math.random

    this.paint = {
      white: s => user.paint('cyan', s),
      black: s => user.paint('magenta', s)
    }
  }

  async start() {
    const players = await this.players()
    const game = await this.start_game(players)

    while (!game.result()) {
      const player = players[game.board.turn]
      this.user.tell(`${player.name()}'s turn as ${game.board.turn}`)

      const play = await player.play(game.clone())

      if (!play) {
        this.user.tell(`${player.name()} forfeits`)
        game.forfeit()

      } else {
        const paint = this.paint[game.board.turn]
        this.user.tell(`${player.name()} plays ${paint(play.ptn())}`)

        try {
          game.perform(play)
        } catch (e) {
          this.user.tell('Illegal play: ' + e.message)
        }
      }
    }

    Object.values(players).forEach(p => p.over(game))
    this.print_result(game, players)
    this.user.bye()
  }

  async players() {
    const player1 = await this.player('Player 1:')
    const player2 = await this.player('Player 2:')

    const start = await this.user.ask('Who is white? (1, 2, [r]andom)')

    const random = this.random()
    if (start == '1' || start != '2' && random < .5) {
      return { white: player1, black: player2 }
    } else {
      return { white: player2, black: player1 }
    }
  }

  async player(prompt) {
    const input = (await this.user.ask(prompt)) || 'bot'
    const [player, ...args] = input.split(' ')
    const file = `../../players/${player}/src/${player}.js`
    const { default: Player } = await this.import(file)
    return new Player(this, ...args)
  }

  async start_game(players) {
    const input = await this.user.ask('Board size: (3-8 [5])')
    const size = Math.max(3, Math.min(8, parseInt(input) || 5))
    const game = new Game(size, players.white.name(), players.black.name())
    return game
  }

  print_result(game) {
    const result = game.result()
    this.user.tell(this.user.paint('red', result.ptn()))

    const timestamp = game.started.slice(0, 19).replace(/\D/g, '_')
    this.user.save(`games/${timestamp}.ptn`, game.ptn())
  }
}
