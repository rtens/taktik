import test from 'ava'
import { Move, parse, PlaceCapstone, PlaceFlat, PlaceWall } from '../../src/model/play.js'
import Cli from '../../src/players/cli.js'
import MockInterface from '../mock_interface.js'
import Game from '../../src/model/game.js'

test('place flat', t => {
  t.deepEqual(parse('a1'), PlaceFlat.at(0, 0))
  t.deepEqual(parse('b1'), PlaceFlat.at(1, 0))
  t.deepEqual(parse('e5'), PlaceFlat.at(4, 4))
})

test('place wall', t => {
  t.deepEqual(parse('Sc1'), PlaceWall.at(2, 0))
  t.deepEqual(parse('Sb1'), PlaceWall.at(1, 0))
  t.deepEqual(parse('Se5'), PlaceWall.at(4, 4))
})

test('place capstone', t => {
  t.deepEqual(parse('Cc1'), PlaceCapstone.at(2, 0))
  t.deepEqual(parse('Cb1'), PlaceCapstone.at(1, 0))
  t.deepEqual(parse('Ce5'), PlaceCapstone.at(4, 4))
})

test('move one', t => {
  t.deepEqual(parse('a1>'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('b2<'), Move.at(1, 1).left().drop(1))
  t.deepEqual(parse('c1-'), Move.at(2, 0).down().drop(1))
  t.deepEqual(parse('c3+'), Move.at(2, 2).up().drop(1))
})

test('move stack', t => {
  t.deepEqual(parse('1a1>'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('2b1<'), Move.at(1, 0).left().drop(2))
  t.deepEqual(parse('3b4+'), Move.at(1, 3).up().drop(3))
  t.deepEqual(parse('4b2-'), Move.at(1, 1).down().drop(4))
})

test('spread stack', t => {
  t.deepEqual(parse('1a1>1'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('2c1<11'), Move.at(2, 0).left().drop(1).drop(1))
  t.deepEqual(parse('3b4+111'), Move.at(1, 3).up().drop(1).drop(1).drop(1))
  t.deepEqual(parse('5e2-122'), Move.at(4, 1).down().drop(1).drop(2).drop(2))
})