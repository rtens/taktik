import { PlaceFlat } from '../model/play.js'
import Player from '../player.js'

export default class Bot extends Player {

  name() {
    return 'Bot'
  }

  play(game) {
    while (true) {
      const play = PlaceFlat.at(
        Math.floor(Math.random() * game.board.size),
        Math.floor(Math.random() * game.board.size)
      )
      try {
        game.perform(play)
        return play
      } catch { }
    }
  }
}