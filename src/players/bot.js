import { PlaceFlat } from '../play.js'
import Player from '../player.js'

export default class Bot extends Player {

  name() {
    return 'Bot'
  }

  play() {
    return PlaceFlat.at(0, 0)
  }
}