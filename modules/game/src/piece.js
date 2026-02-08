class Piece {

  constructor(color) {
    this.color = color
  }

  clone() {
    return new this.constructor(this.color)
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

  clone() {
    const clone = super.clone()
    clone.standing = this.standing
    return clone
  }
}

export class Cap extends Piece {

}
