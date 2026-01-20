import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'

test('existing file', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const imported = []
  runner.import = file => {
    imported.push(file)
    return { default: class { } }
  }

  runner.run()

  await inter.answer("Player 1:", "foo")
  await inter.answer("Player 2:", "bar")
  await inter.next()

  t.like(imported, [
    './players/foo.js',
    './players/bar.js'
  ])
})

test('with arguments', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const constructed = []
  runner.import = () => ({
    default: class {
      constructor(runner, ...args) {
        t.assert(runner instanceof Runner)
        constructed.push(args)
      }
    }
  })

  runner.run()

  await inter.answer("Player 1:", "foo one two")
  await inter.answer("Player 2:", "bar tre")
  await inter.next()

  t.like(constructed, [
    ['one', 'two'],
    ['tre']
  ])
})