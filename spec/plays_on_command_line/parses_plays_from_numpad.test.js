import test from 'ava'
import Move from '../../src/model/move.js'
import parse from '../../src/model/parse.js'
import Place from '../../src/model/place.js'

test('place flat', t => {
  t.deepEqual(parse('11'), Place.Flat.at(0, 0))
  t.deepEqual(parse('21'), Place.Flat.at(1, 0))
  t.deepEqual(parse('55'), Place.Flat.at(4, 4))
})

test('place wall', t => {
  t.deepEqual(parse('/31'), Place.Wall.at(2, 0))
  t.deepEqual(parse('/21'), Place.Wall.at(1, 0))
  t.deepEqual(parse('/55'), Place.Wall.at(4, 4))
})

test('place cap', t => {
  t.deepEqual(parse('*31'), Place.Cap.at(2, 0))
  t.deepEqual(parse('*21'), Place.Cap.at(1, 0))
  t.deepEqual(parse('*55'), Place.Cap.at(4, 4))
})

test('move one', t => {
  t.deepEqual(parse('11.'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('11,'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('220'), Move.at(1, 1).left().drop(1))
  t.deepEqual(parse('31-'), Move.at(2, 0).down().drop(1))
  t.deepEqual(parse('33+'), Move.at(2, 2).up().drop(1))
})

test('move stack', t => {
  t.deepEqual(parse('111.'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('111,'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('2210'), Move.at(1, 0).left().drop(2))
  t.deepEqual(parse('324+'), Move.at(1, 3).up().drop(3))
  t.deepEqual(parse('422-'), Move.at(1, 1).down().drop(4))
})

test('spread stack', t => {
  t.deepEqual(parse('111.1'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('111,1'), Move.at(0, 0).right().drop(1))
  t.deepEqual(parse('231011'), Move.at(2, 0).left().drop(1).drop(1))
  t.deepEqual(parse('324+111'), Move.at(1, 3).up().drop(1).drop(1).drop(1))
  t.deepEqual(parse('552-122'), Move.at(4, 1).down().drop(1).drop(2).drop(2))
})