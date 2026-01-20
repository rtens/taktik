import readline from 'readline'

export default class Interface {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  print(value) {
    console.log(value)
  }

  async read(prompt) {
    process.stdout.write(prompt + ' ')
    return (await this.rl[Symbol.asyncIterator]().next()).value
  }

  close() {
    this.rl.close()
  }
}