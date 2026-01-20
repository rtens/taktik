export default class MockInterface {

  constructor() {
    this.output = []
    this.resolve = () => null
  }

  print(line) {
    this.output.push(line)
    this.resolve()
  }

  async read(prompt) {
    this.output.push(prompt)
    this.resolve()

    return new Promise(y => this.input = y)
  }

  async expect(line) {
    const got = []

    while (true) {
      await this.next(('Expected:\n   ' + line + '\ngot\n - ' + got.join('\n - ')))

      const actual = this.output.shift()
      if (actual == line) return
      got.push(actual)
    }
  }

  async next(fail) {
    if (!this.output.length)
      await new Promise((y, n) => {
        this.resolve = y
        setTimeout(() => n(fail), 10)
      })
  }

  async answer(prompt, response) {
    await this.expect(prompt)
    this.input(response)
  }
}
