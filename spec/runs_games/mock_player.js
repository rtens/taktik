import { parse, PlaceFlat } from '../../src/model/play.js'
import Player from '../../src/player.js'

export default class MockPlayer extends Player {

  constructor(runner, name) {
    super(runner)
    this.name = () => name
  }

  static import() {
    return () => ({
      default: this
    })
  }

  play(game) {
    return PlaceFlat.at(
      game.plays.length % game.board.size,
      Math.floor(game.plays.length / game.board.size))
  }
}

MockPlayer.playing = plays =>
  class extends MockPlayer {
    play() {
      const play = plays.shift()
      return play ? parse(play) : null
    }
  }