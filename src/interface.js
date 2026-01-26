import fs from 'fs'
import path from 'path'
import readline from 'readline'

export default class Interface {
  constructor(args) {
    this.args = args
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  print(value) {
    console.log(value)
  }

  async read(prompt) {
    process.stdout.write(this.colored('white', prompt) + ' ')
    if (this.args.length) {
      this.print(this.args[0])
      return this.args.shift()
    }
    return (await this.rl[Symbol.asyncIterator]().next()).value
  }

  close() {
    this.rl.close()
  }

  save(file, content) {
    const dir = path.dirname(file)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    fs.writeFileSync(file, content)
  }

  colored(color, output) {
    return `\x1b[${colors[color]}m${output}\x1b[0m`
  }
}

const colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
}