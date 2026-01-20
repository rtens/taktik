import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'

test('draw', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing_ptn([
    'a1', 'b1', 'Cc2', 'Cc3',
    ...[...Array(20)].reduce(a => [...a,
      'a2', 'b2', 'a2-', 'b2-'], [])
  ]).import()

  runner.run()

  await inter.answer("Player 1:", "foo One")
  await inter.answer("Player 2:", "foo Two")
  await inter.answer("Who is white? (1, 2, [r]andom)", "1")
  await inter.answer("Board size: (3-8 [5])", "5")
  await inter.expect("It's a draw")
  await inter.expect("1/2-1/2")

  t.pass()
})