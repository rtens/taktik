export default class MockInterface {

  constructor() {
    this.outputs = []
    this.answers = {}
  }

  print(line) {
    this.outputs.push(line)
  }

  read(prompt) {
    if (!(prompt in this.answers))
      return ''

    return this.answers[prompt].shift()
  }

  answer(prompt, response) {
    this.answers[prompt] ||= []
    this.answers[prompt].push(response)
  }

  close() {
    this.closed = true
  }
}
