import test from 'ava'
import Board from '../../src/model/board.js'
import Bot from '../../src/players/bot.js'
import { Move, parse } from '../../src/model/play.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('empty board', t => {
  const board = new Board(5)

  const plays = new Bot()
    .legal_plays(board, 'white')

  t.is(plays.length, 25 * 3)
  t.like(plays.map(p => p.ptn()), [
    'a1', 'Sa1', 'Ca1',
    'a2', 'Sa2', 'Ca2'
  ])
})

test('no stones', t => {
  const board = new Board(5)
  board.white.stones = []

  const plays = new Bot()
    .legal_plays(board, 'white')

  t.is(plays.length, 25)
  t.like(plays.map(p => p.ptn()), [
    'Ca1', 'Ca2', 'Ca3'
  ])
})

test('no capstones', t => {
  const board = new Board(5)
  board.white.capstones = []

  const plays = new Bot()
    .legal_plays(board, 'white')

  t.is(plays.length, 25 * 2)
  t.like(plays.map(p => p.ptn()), [
    'a1', 'Sa1', 'a2', 'Sa2'
  ])
})

test('occupied square', t => {
  const board = new Board(3)
  parse('a1').apply(board, 'white')

  const plays = new Bot()
    .legal_plays(board, 'black')

  t.is(plays.length, 8 * 2)
  t.like(plays.map(p => p.ptn()), [
    'a2', 'Sa2', 'a3', 'Sa3'
  ])
})

test('single piece', t => {
  const board = new Board(3)
  parse('b2').apply(board, 'white')

  const plays = new Bot()
    .legal_plays(board, 'white')

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn()),
    [
      'b2+', 'b2-', 'b2>', 'b2<'
    ])
})

test('limited directions', t => {
  const board = new Board(3)
  parse('b2').apply(board, 'white')
  parse('Sc2').apply(board, 'black')
  parse('Sb3').apply(board, 'black')

  const plays = new Bot()
    .legal_plays(board, 'white')

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn()),
    [
      'b2-', 'b2<'
    ])
})

test.skip('lonely stack', t => {
  const board = new Board(3)
  board.squares['b2'].stack(new Stack([
    new Stone('black'),
    new Stone('white'),
    new Stone('black'),
  ]))

  const plays = new Bot()
    .legal_plays(board, 'white')

  t.deepEqual(plays
              .filter(p => p instanceof Move)
              .map(p => p.ptn())
              .filter(p => p.contains('>')),
    [
      'b2>',
      '2b2>',
      '2b2>11',
      '3b2>',
      '3b2>21',
      '3b2>12',
      '3b2>111'
    ])
})

test.todo('walled off')

test.todo('wall smash')
