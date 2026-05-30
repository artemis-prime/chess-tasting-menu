import type Position from '../model/position'
import { positionsEqual } from '../model/position'
import type SquareState from '../model/square-state'
import type Resolution from '../model/resolution'
import type Check from '../model/check'

// Convienence for game implementations / ui's.
const getResolutionStateForPosition = (
  p: Position,
  res: Resolution | null
): SquareState => {

  if (res && positionsEqual(res.move.from, p)) {
    return 'origin'
  }
  if (res) {
    if (positionsEqual(res.move.to, p)) {
      if (res.type) {
        return res.type
      }
      else {
        return 'invalid'
      }
    }
    else if (res.type === 'castle') {
      const { move: { from, to }} = res
      if (to.file === 'g') {
        if (positionsEqual(p, {rank: from.rank, file: 'h'})) {
          return 'castleRookFrom'
        }
        else if (positionsEqual(p, {rank: from.rank, file: 'f'})) {
          return 'castleRookTo'
        }
      }
      else if (to.file === 'c') {
        if (positionsEqual(p, {rank: from.rank, file: 'a'})) {
          return 'castleRookFrom'
        }
        else if (positionsEqual(p, {rank: from.rank, file: 'd'})) {
          return 'castleRookTo'
        }
      }
    }
  }
  return 'none'
}


const getCheckStateForPosition = (
  p: Position,
  check: Check | null
): SquareState => {
  if (check) {
    if (positionsEqual(check.kingPosition, p)) {
      return 'kingInCheck'
    }
    else if (check.from.find((from) => (positionsEqual(p, from)))) {
      return 'inCheckFrom'
    }
  }
  return 'none'
}

export { getResolutionStateForPosition, getCheckStateForPosition }