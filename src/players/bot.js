import Board from '../model/board.js'
import { Move, PlaceCapstone, PlaceFlat, PlaceWall } from '../model/play.js'
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

  legal_plays(board, color) {
    const plays = []

    for (const square of Object.values(board.squares)) {
      if (square.empty()) {
        if (board[color].stones.length)
          plays.push(
            new PlaceFlat(square.coords),
            new PlaceWall(square.coords))

        if (board[color].capstones.length)
          plays.push(
            new PlaceCapstone(square.coords))

      } else if (square.top().color == color) {
        for (const dir of Object.keys(Move.directions)) {
          const height = square.pieces.length
          const drops = [[height]]

          for (const dropped of drops) {
            const move = new Move(square.coords).to(dir)
            for (const drop of dropped) {
              move.drop(drop)
            }

            try {
              move.apply(board.clone(), color)
              plays.push(move)
            } catch { }
          }
        }
      }
    }

    return plays
  }
}