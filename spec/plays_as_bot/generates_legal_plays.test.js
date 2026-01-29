import test from 'ava'
import Board from '../../src/model/board.js'
import Bot from '../../src/players/bot.js'
import Move from '../../src/model/move.js'
import Stack from '../../src/model/stack.js'
import { Stone, Cap } from '../../src/model/piece.js'

test('empty board', t => {
  const board = new Board(5)

  const plays = new Bot()
    .legal_plays(board)

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
    .legal_plays(board)

  t.is(plays.length, 25)
  t.like(plays.map(p => p.ptn()), [
    'Ca1', 'Ca2', 'Ca3'
  ])
})

test('no caps', t => {
  const board = new Board(5)
  board.white.caps = []

  const plays = new Bot()
    .legal_plays(board)

  t.is(plays.length, 25 * 2)
  t.like(plays.map(p => p.ptn()), [
    'a1', 'Sa1', 'a2', 'Sa2'
  ])
})

test('occupied square', t => {
  const board = new Board(3)
  board.squares['a1'].stack(new Stack([
    new Stone('black')]))

  const plays = new Bot()
    .legal_plays(board)

  t.is(plays.length, 8 * 2)
  t.like(plays.map(p => p.ptn()), [
    'a2', 'Sa2', 'a3', 'Sa3'
  ])
})

test('single piece', t => {
  const board = new Board(3)
  board.squares['b2'].stack(new Stack([
    new Stone('white')]))

  const plays = new Bot()
    .legal_plays(board)

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn()),
    [
      'b2+', 'b2-', 'b2>', 'b2<'
    ])
})

test('limited directions', t => {
  const board = new Board(3)
  board.squares['b2'].stack(new Stack([
    new Stone('white')]))
  board.squares['c2'].stack(new Stack([
    new Stone('black').stand()]))
  board.squares['b3'].stack(new Stack([
    new Stone('black').stand()]))

  const plays = new Bot()
    .legal_plays(board)

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn()),
    [
      'b2-', 'b2<'
    ])
})

test('lonely stack', t => {
  const board = new Board(7)
  board.squares['d4'].stack(new Stack([
    new Stone('white'),
    new Stone('white'),
    new Stone('white'),
  ]))

  const plays = new Bot()
    .legal_plays(board)

  for (const d of Object.keys(Move.directions))
    t.deepEqual(plays
      .filter(p => p instanceof Move)
      .map(p => p.ptn())
      .filter(p => p.includes(d)),
      [
        `d4${d}`,
        `2d4${d}`,
        `2d4${d}11`,
        `3d4${d}`,
        `3d4${d}21`,
        `3d4${d}12`,
        `3d4${d}111`,
      ])
})

test('small board', t => {
  const board = new Board(5)
  board.squares['c3'].stack(new Stack([
    new Stone('white'),
    new Stone('white'),
    new Stone('white'),
  ]))

  const plays = new Bot()
    .legal_plays(board)

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn())
    .filter(p => p.includes('>')),
    [
      'c3>',
      '2c3>',
      '2c3>11',
      '3c3>',
      '3c3>21',
      '3c3>12',
    ])
})

test('walled off', t => {
  const board = new Board(5)
  board.squares['c3'].stack(new Stack([
    new Stone('white'),
    new Stone('white'),
  ]))
  board.squares['d3'].stack(new Stack([
    new Stone('black').stand()
  ]))
  board.squares['c5'].stack(new Stack([
    new Stone('black').stand()
  ]))
  board.squares['c2'].stack(new Stack([
    new Stone('black').stand()
  ]))
  board.squares['b3'].stack(new Stack([
    new Cap('black')
  ]))

  const plays = new Bot()
    .legal_plays(board)

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn())
    .filter(p => p.includes('>')),
    [])

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn()),
    [
      'c3+',
      '2c3+',
    ])
})

test('carry limit', t => {
  const board = new Board(3)
  board.squares['a1'].stack(new Stack([
    new Stone('white'),
    new Stone('white'),
    new Stone('white'),
    new Stone('white'),
  ]))

  const plays = new Bot()
    .legal_plays(board)

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn())
    .filter(p => p.includes('>')),
    [
      `a1>`,
      `2a1>`,
      `2a1>11`,
      `3a1>`,
      `3a1>21`,
      `3a1>12`
    ])
})

test('wall smash', t => {
  const board = new Board(3)
  board.squares['a1'].stack(new Stack([
    new Stone('white'),
    new Stone('white'),
    new Cap('white'),
  ]))
  board.squares['c1'].stack(new Stack([
    new Stone('black').stand()
  ]))
  board.squares['a2'].stack(new Stack([
    new Stone('black').stand()
  ]))

  const plays = new Bot()
    .legal_plays(board)

  t.deepEqual(plays
    .filter(p => p instanceof Move)
    .map(p => p.ptn()),
    [
      'a1+',
      `a1>`,
      `2a1>`,
      `2a1>11`,
      `3a1>`,
      `3a1>21`,
    ], board.print())
})

test('full board', t => {
  const board = new Board(3);

  ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
    .forEach((c, i) =>
      board.squares[c].stack(new Stack([
        new Stone(i % 2 ? 'white' : 'black')])))

  const plays = new Bot()
    .legal_plays(board)

  t.is(plays.length, 0)
})

test('white road', t => {
  const board = new Board(3);

  ['a1', 'b1', 'c1']
    .forEach((c, i) =>
      board.squares[c].stack(new Stack([
        new Stone('white')])))

  const plays = new Bot()
    .legal_plays(board)

  t.is(plays.length, 0)
})

test('black road', t => {
  const board = new Board(3);

  ['a1', 'b1', 'c1']
    .forEach((c, i) =>
      board.squares[c].stack(new Stack([
        new Stone('black')])))

  board.turn = 'black'
  const plays = new Bot()
    .legal_plays(board)

  t.is(plays.length, 0)
})
