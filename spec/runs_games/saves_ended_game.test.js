import test from 'ava'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'
import Runner from '../../src/runner.js'

test('save game ptn', async t => {
  const _Date = Date
  global.Date = class {
    toISOString() {
      return '2020-12-13T14:15:16.178Z'
    }
  }

  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  global.Date = _Date

  t.deepEqual(inter.saved, [{
    file: 'games/2020_12_13_14_15_16',
    content:
      `[Site "takbot"]` + '\n' +
      `[Event "Local Play"]` + '\n' +
      `[Date "2020.12.13"]` + '\n' +
      `[Time "14:15:16"]` + '\n' +
      `[Player1 "One"]` + '\n' +
      `[Player2 "Two"]` + '\n' +
      `[Clock "none"]` + '\n' +
      `[Result "F-0"]` + '\n' +
      `[Size "3"]` + '\n' +
      `` + '\n' +
      `1. a1 b1` + '\n' +
      `2. c1 a2` + '\n' +
      `3. b2 c2` + '\n' +
      `4. a3 b3` + '\n' +
      `5. c3` + '\n' +
      `F-0`
  }])
})