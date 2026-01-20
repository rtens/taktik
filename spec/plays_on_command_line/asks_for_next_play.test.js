import test from 'ava'
import Cli from '../../src/players/cli.js'
import MockInterface from '../mock_interface.js'
import { parse } from '../../src/model/play.js'

test('First play', async t => {
  const inter = new MockInterface()
  const cli = new Cli({
    interface: inter
  }, 'Foo')

  inter.answer('Your play:', 'a1')
  const play = await cli.play()

  t.deepEqual(parse('a1'), play)
})