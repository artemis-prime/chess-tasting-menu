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
  legalMovesAndCapture
} from '../util'

const legalAs = (
  board: Board,
  move: Move,
  messageFn?: (s: string) => void
): MoveType | null => {
  
  if (board.isClearAlongRank(move.from, move.to) || board.isClearAlongFile(move.from, move.to) ) {
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

  return [...resolvableN, ...resolvableS, ...resolvableE, ...resolvableW]
}

export default {legalAs, legalMoves}
