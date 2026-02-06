import test from 'ava'
import MockUser from './lib/mock_user.js'
import MockPlayer from './lib/mock_player.js'
import Moderator from '../src/moderator.js'
import Place from '../../game/src/place.js'

test('flat win white', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.playing(
    Place.Flat.at(0, 1), Place.Flat.at(0, 0),
    Place.Flat.at(0, 2), Place.Flat.at(1, 0),
    Place.Flat.at(1, 1), Place.Flat.at(1, 2),
    Place.Flat.at(2, 0), Place.Flat.at(2, 1),
    Place.Flat.at(2, 2),
  ).importer()
  await mod.start()

  t.deepEqual(user.told.slice(-2), [
    'one plays c3',
    'F-0'
  ])
})

test('flat win black', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.playing(
    Place.Flat.at(0, 1), Place.Flat.at(0, 0),
    Place.Wall.at(0, 2), Place.Flat.at(1, 0),
    Place.Wall.at(1, 1), Place.Flat.at(1, 2),
    Place.Wall.at(2, 0), Place.Flat.at(2, 1),
    Place.Wall.at(2, 2),
  ).importer()
  await mod.start()

  t.deepEqual(user.told.slice(-2), [
    'one plays Sc3',
    '0-F'
  ])
})

test('road win white', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.playing(
    Place.Flat.at(0, 1), Place.Flat.at(0, 0),
    Place.Flat.at(1, 0), Place.Wall.at(2, 2),
    Place.Flat.at(2, 0)
  ).importer()
  await mod.start()

  t.deepEqual(user.told.slice(-2), [
    'one plays c1',
    'R-0'
  ])
})

test('road win black', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.playing(
    Place.Flat.at(0, 1), Place.Flat.at(0, 0),
    Place.Wall.at(2, 2), Place.Flat.at(1, 1),
    Place.Wall.at(1, 0), Place.Flat.at(2, 1)
  ).importer()
  await mod.start()

  t.deepEqual(user.told.slice(-2), [
    'two plays c2',
    '0-R'
  ])
})

test('forfeit white', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.importer()
  await mod.start()

  t.deepEqual(user.told.slice(-3), [
    'one\'s turn as white',
    'one forfeits',
    '0-1'
  ])
})

test('forfeit black', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.playing(
    Place.Flat.at(0, 0)
  ).importer()
  await mod.start()

  t.deepEqual(user.told.slice(-3), [
    'two\'s turn as black',
    'two forfeits',
    '1-0'
  ])
})

test('close stream', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.importer()
  await mod.start()

  t.is(user.closed, true)
})

test('tell players', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'one')
  user.answer('Player 2', 'two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  const over = []
  mod.import = file => ({
    default: class extends MockPlayer {
      over(game) {
        over.push([
          file.slice(-6),
          game.result().ptn()
        ])
      }
    }
  })
  await mod.start()

  t.deepEqual(over, [
    ['one.js', '0-1',],
    ['two.js', '0-1',],
  ])
})

test('save ptn', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')
  user.answer('Board size', '3')

  mod.import = MockPlayer.playing(
    Place.Flat.at(0, 0), Place.Flat.at(2, 2),
    Place.Wall.at(1, 1)
  ).importer()
  await mod.start()

  t.is(user.saved.length, 1)
  t.assert(user.saved[0].file.match(/^games\/\d{4}(_\d{2}){5}.ptn$/))
  t.deepEqual(user.saved[0].content.split('\n').slice(-9), [
    '[Player1 "one"]',
    '[Player2 "two"]',
    '[Clock "none"]',
    '[Result "1-0"]',
    '[Size "3"]',
    '',
    '1. a1 c3',
    '2. Sb2',
    '1-0'
  ])
})