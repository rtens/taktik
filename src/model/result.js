class Result {

  ptn() {
    throw new Error('not implemented')
  }
}

export class Draw extends Result {

  ptn() {
    return '1/2-1/2'
  }
}

class Win extends Result {

  constructor(color) {
    super()
    this.color = color
  }
}

export class RoadWin extends Win {

  ptn() {
    return this.color == 'white'
      ? 'R-0'
      : '0-R'
  }
}

export class FlatWin extends Win {

  ptn() {
    return this.color == 'white'
      ? 'F-0'
      : '0-F'
  }
}