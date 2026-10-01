import test from 'ava'
import Place from '../src/place.js'
import Move from '../src/move.js'
import Game from '../src/game.js'
import { Draw, FlatWin, Forfeit, RoadWin } from '../src/result.js'

test('places', t => {
  t.is(Place.Flat.at(0, 0).ptn(), 'a1')
  t.is(Place.Wall.at(1, 2).ptn(), 'Sb3')
  t.is(Place.Cap.at(4, 3).ptn(), 'Ce4')
  t.is(Place.Stack.at(2, 2).ptn(), '2c3')
})

test('moves', t => {
  t.is(Move.at(0, 0).right().drop(1).ptn(), 'a1>')
  t.is(Move.at(2, 1).left().drop(1).ptn(), 'c2<')
  t.is(Move.at(3, 4).up().drop(1).ptn(), 'd5+')
  t.is(Move.at(2, 2).down().drop(1).ptn(), 'c3-')
  t.is(Move.at(3, 3).up().drop(3).ptn(), '3d4+')
  t.is(Move.at(1, 1).right().drop(2).drop(1).drop(3).ptn(), '6b2>213')
})

test('results', t => {
  t.is(new Draw().ptn(), '1/2-1/2')
  t.is(new RoadWin('white').ptn(), 'R-0')
  t.is(new RoadWin('black').ptn(), '0-R')
  t.is(new FlatWin('white').ptn(), 'F-0')
  t.is(new FlatWin('black').ptn(), '0-F')
  t.is(new Forfeit('white').ptn(), '0-1')
  t.is(new Forfeit('black').ptn(), '1-0')
})

test('game', t => {
  const game = new Game(3, 'One', 'Two')
  game.started = '2000-11-12T13:14:15.123Z'

  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(0, 1).commented('Some comment'))
  game.perform(Place.Wall.at(1, 1))
  game.forfeit()

  t.is(game.ptn(),
    '[Site "taktik"]\n' +
    '[Event "Local Play"]\n' +
    '[Date "2000.11.12"]\n' +
    '[Time "13:14:15"]\n' +
    '[Player1 "One"]\n' +
    '[Player2 "Two"]\n' +
    '[Clock "none"]\n' +
    '[Result "1-0"]\n' +
    '[Size "3"]\n' +
    '\n' +
    '1. a1 a2 {Some comment}\n' +
    '2. Sb2\n' +
    '1-0')
})