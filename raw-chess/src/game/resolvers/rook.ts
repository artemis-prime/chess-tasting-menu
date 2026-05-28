import type { 
  Action, 
  Piece, 
  Position, 
  Move, 
  Resolution,
} from '../..'

import type Board from '../Board'

import {
  nextN,
  nextS,
  nextE,
  nextW,
  resolvableMovesAndCapture
} from '../util'

const resolve = (
  board: Board,
  move: Move,
  messageFn?: (s: string) => void
): Action | null => {
  
  if (board.isClearAlongRank(move.from, move.to) || board.isClearAlongFile(move.from, move.to) ) {
    const fromSide = board.getOccupantSide(move.from)
    const toSide = board.getOccupantSide(move.to)
    if (!toSide) {
      return 'move'
    }
    else if (fromSide && toSide && (fromSide !== toSide)) {
      return 'capture'
    }
  }
  return null
}

const resolvableMoves = (
  board: Board,
  piece: Piece,
  from: Position,
  ignoreCastling?: boolean // only relevant for king
): Resolution[] => {

  const resolvableN = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextN
  )

  const resolvableS = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextS
  )

  const resolvableE = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextE
  )

  const resolvableW = resolvableMovesAndCapture(
    board,
    piece,
    from,
    nextW
  )

  return [...resolvableN, ...resolvableS, ...resolvableE, ...resolvableW]
}

export default {resolve, resolvableMoves}
