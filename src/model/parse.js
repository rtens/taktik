import Coords from './coords.js'
import Move from './move.js'
import Place from './place.js'

export default function parse(ptn) {
  if (ptn.length == 2) {
    return new Place.Flat(parse_coords(ptn))

  } else if (ptn.startsWith('S') || ptn.startsWith('/')) {
    return new Place.Wall(parse_coords(ptn.slice(1)))

  } else if (ptn.startsWith('C') || ptn.startsWith('*')) {
    return new Place.Cap(parse_coords(ptn.slice(1)))

  } else if (ptn.length == 3) {
    return new Move(parse_coords(ptn.slice(0, 2)))
      .to(direction(ptn.slice(2)))
      .drop(1)

  } else if (ptn.length == 4) {
    return new Move(parse_coords(ptn.slice(1, 3)))
      .to(direction(ptn.slice(3)))
      .drop(parseInt(ptn.slice(0, 1)))

  } else {
    return new Move(parse_coords(ptn.slice(1, 3)))
      .to(direction(ptn.slice(3, 4)))
      .dropping(ptn.slice(4).split('').map(n => parseInt(n)))
  }
}

function direction(symbol) {
  if (symbol == '.') return '>'
  if (symbol == ',') return '>'
  if (symbol == '0') return '<'
  return symbol
}

function parse_coords(coords) {
  if (coords.match(/^\d+$/))
    return new Coords(
      parseInt(coords[0]) - 1,
      parseInt(coords[1]) - 1)

  return new Coords(
    coords.charCodeAt(0) - 97,
    parseInt(coords[1]) - 1)
}