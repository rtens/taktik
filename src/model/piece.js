class Piece {

  constructor(color) {
    this.color = color
  }
}

export class Stone extends Piece {

  constructor(color) {
    super(color)
    this.standing = false
  }

  stand() {
    this.standing = true
    return this
  }

  flat() {
    this.standing = false
    return this
  }
}

export class Capstone extends Piece {

}