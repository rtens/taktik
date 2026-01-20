export default class Coords {

  constructor(file, rank) {
    this.file = file
    this.rank = rank
  }

  static from(name) {
    return new Coords(
      name.charCodeAt(0) - 97,
      parseInt(name.slice(1)) - 1
    )
  }

  moved(by) {
    return new Coords(
      this.file + by.file,
      this.rank + by.rank)
  }

  name() {
    return String.fromCharCode(97 + this.file) + (this.rank + 1)
  }
}