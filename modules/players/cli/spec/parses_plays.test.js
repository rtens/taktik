import test from 'ava'
import Cli from '../src/cli.js'
import Place from '../../../game/src/place.js'
import Move from '../../../game/src/move.js'

test('asks for play', async t => {
  const asked = []
  const cli = new Cli({
    user: {
      ask: async prompt =>
        asked.push(prompt)
    }
  })

  await cli.play()

  t.deepEqual(asked, ['Your play:'])
})

test('forfeit', async t => {
  const cli = new Cli({
    user: {
      ask: async () => null
    }
  })

  const played = await cli.play()

  t.is(played, null)
})

test('parse ptn', async t => {
  await parse(t, 'a1', Place.Flat.at(0, 0))
  await parse(t, '2a1', Place.Stack.at(0, 0))
  await parse(t, 'c4', Place.Flat.at(2, 3))
  await parse(t, 'Sb2', Place.Wall.at(1, 1))
  await parse(t, 'Ce1', Place.Cap.at(4, 0))
  await parse(t, 'a1>', Move.at(0, 0).right().drop(1))
  await parse(t, 'b1<', Move.at(1, 0).left().drop(1))
  await parse(t, 'a1+', Move.at(0, 0).up().drop(1))
  await parse(t, 'a2-', Move.at(0, 1).down().drop(1))
  await parse(t, '3a1+', Move.at(0, 0).up().drop(3))
  await parse(t, '1a1>', Move.at(0, 0).right().drop(1))
  await parse(t, '4a1>121', Move.at(0, 0).right().drop(1).drop(2).drop(1))
  await parse(t, '0a1>31', Move.at(0, 0).right().drop(3).drop(1))
})

test('parse numpad', async t => {
  await parse(t, '11', Place.Flat.at(0, 0))
  await parse(t, '211', Place.Flat.at(0, 0))
  await parse(t, '34', Place.Flat.at(2, 3))
  await parse(t, '/22', Place.Wall.at(1, 1))
  await parse(t, '*51', Place.Cap.at(4, 0))
  await parse(t, '11.', Move.at(0, 0).right().drop(1))
  await parse(t, '210', Move.at(1, 0).left().drop(1))
  await parse(t, '11+', Move.at(0, 0).up().drop(1))
  await parse(t, '12-', Move.at(0, 1).down().drop(1))
  await parse(t, '311+', Move.at(0, 0).up().drop(3))
  await parse(t, '111.', Move.at(0, 0).right().drop(1))
  await parse(t, '411.121', Move.at(0, 0).right().drop(1).drop(2).drop(1))
})

async function parse(t, ptn, play) {
  const cli = new Cli({
    user: {
      ask: async () => ptn
    }
  })

  const played = await cli.play()

  t.deepEqual(played, play)
}