export default class Coords {

  constructor(file, rank) {
    this.file = file
    this.rank = rank
    this.name = String.fromCharCode(97 + file) + (rank + 1)
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
}