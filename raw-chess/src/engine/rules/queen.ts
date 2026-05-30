import type { 
  MoveType, 
  Piece, 
  Position, 
  Move, 
  LegalMove,
} from '../..'

import type Board from '../board'

import {
  nextN,
  nextS,
  nextE,
  nextW,
  nextNE,
  nextNW,
  nextSE,
  nextSW,
  legalMovesAndCapture
} from '../util'

const legalMove = (
  board: Board,
  from: Position, 
  to: Position, 
): boolean => {
  
  return (
    board.isClearAlongRank(from, to)
    ||
    board.isClearAlongFile(from, to)
    ||
    board.isClearAlongDiagonal(from, to)
  ) 
}

const legalAs = (
  board: Board,
  move: Move,
  messageFn?: (s: string) => void
): MoveType | null => {
  
  if (legalMove(board, move.from, move.to)) {
    const fromSide = board.getOccupantSide(move.from)
    const toSide = board.getOccupantSide(move.to)
    if (!toSide) {
      return 'simple'
    }
    else if (fromSide && toSide && (fromSide !== toSide)) {
      return 'capture'
    }
  }
  return null
}

const legalMoves = (
  board: Board,
  piece: Piece,
  from: Position,
  ignoreCastling?: boolean // only relevant for king
): LegalMove[] => {

  const resolvableNE = legalMovesAndCapture(
    board,
    piece,
    from,
    nextNE
  )

  const resolvableSE = legalMovesAndCapture(
    board,
    piece,
    from,
    nextSE
  )

  const resolvableNW = legalMovesAndCapture(
    board,
    piece,
    from,
    nextNW
  )

  const resolvableSW = legalMovesAndCapture(
    board,
    piece,
    from,
    nextSW
  )

  const resolvableN = legalMovesAndCapture(
    board,
    piece,
    from,
    nextN
  )

  const resolvableS = legalMovesAndCapture(
    board,
    piece,
    from,
    nextS
  )

  const resolvableE = legalMovesAndCapture(
    board,
    piece,
    from,
    nextE
  )

  const resolvableW = legalMovesAndCapture(
    board,
    piece,
    from,
    nextW
  )

  return [
    ...resolvableN, 
    ...resolvableS, 
    ...resolvableE, 
    ...resolvableW,
    ...resolvableNE, 
    ...resolvableSE,
    ...resolvableNW,
    ...resolvableSW
  ]
}

export default {legalAs, legalMoves}
