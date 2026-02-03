class Result {

}

export class Draw extends Result {

}

export class Win extends Result {

  constructor(color) {
    super()
    this.color = color
  }
}

export class RoadWin extends Win {

}

export class FlatWin extends Win {

}

export class Forfeit extends Win {

  constructor(by) {
    super(by == 'white' ? 'black' : 'white')
    this.by = by
  }
}
