export default class Player {

  constructor(runner) {
    this.runner = runner
  }

  name() {
    throw new Error('not implemented')
  }

  async play(_game) {
    throw new Error('not implemented')
  }
}