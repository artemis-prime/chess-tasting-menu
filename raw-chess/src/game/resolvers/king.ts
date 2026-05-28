import type { 
  Action,
  Side,
  Position,
  Piece,
  Move,
  Resolution
} from '../..'

import { FILES, positionsEqual } from '../../Position'
import { isOpponent } from '../../Piece'

import type Board from '../Board'

import {
  hasN,
  hasS,
  hasE,
  hasW,
  getNRank,
  getSRank,
  getEFile,
  getWFile,
} from '../util'

  // from must be populated
const canBeCapturedAlongRank = (board: Board, from: Position, to: Position, asSide: Side): boolean => {
  if (from.rank === to.rank) {
    const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
    if (delta < 0) {
        // zero based, but ok since indexed from FILES
      for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
        if (board.positionCanBeCaptured({rank: from.rank, file: FILES[fileIndex]}, asSide)) {
          return true
        }
      }
    }
    else {
        // zero based, but ok since indexed from FILES
      for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
        if (board.positionCanBeCaptured({rank: from.rank, file: FILES[fileIndex]}, asSide)) {
          return true
        }
      }
    }
  }
  return false
}

const legalMove = (move: Move): boolean => {
  
  const deltaRank = move.to.rank - move.from.rank
  const deltaFile = FILES.indexOf(move.to.file) - FILES.indexOf(move.from.file)

  return (
    Math.abs(deltaRank) === 1 && Math.abs(deltaFile) === 1
    ||
    Math.abs(deltaFile) === 1 && Math.abs(deltaRank) === 0
    ||
    Math.abs(deltaFile) === 0 && Math.abs(deltaRank) === 1
  ) 
}

const amCastling = (
  board: Board, 
  move: Move,
  messageFn?: (s: string) => void
): boolean => {

  const homeRank = (move.piece.side === 'white') ? 1 : 8

  const correctSquares = 
    (move.from.rank === move.to.rank) 
    && 
    (move.from.rank === homeRank) 
    && 
    ((move.to.file === 'g') ||(move.to.file === 'c'))

  let eligable = false
  if (correctSquares) {
    const reasonDenied = board.cannotCastleBecause(
      move.piece.side, 
      (move.to.file === 'g') ? 'kingside' : 'queenside' 
    )
    if (reasonDenied) {
      if (messageFn) {
        messageFn(reasonDenied)
      }
    }
    else {
      eligable = true 
    }
  }

  return (
    eligable
    && 
    board.isClearAlongRank(move.from, {rank: homeRank, file: ((move.to.file === 'g') ? 'h' : 'b')})
    &&  
      // Cannot castle THROUGH check either!
    !canBeCapturedAlongRank(
        board, 
        move.from, 
        {rank: homeRank, file: ((move.to.file === 'g') ? 'h' : 'b')}, 
        move.piece.side
      )
  ) 
}

const castlablePositions = (
  board: Board, 
  piece: Piece,
  from: Position 
): Position[] => {

  const positions = [] as Position[]

  const rank = (piece.side === 'white') ? 1 : 8

  const correctSquare = positionsEqual(from, {rank, file: 'e'})
  const eligableKingside = correctSquare && board.eligableToCastle(piece.side, 'kingside')
  const eligableQueenside = correctSquare && board.eligableToCastle(piece.side, 'queenside')

  if (eligableKingside
    && 
    board.isClearAlongRank(from, {rank, file: 'h'}) 
    &&
    !canBeCapturedAlongRank(board, from, {rank, file: 'h'}, piece.side)
  ) {
    positions.push({file: 'g', rank})
  }

  if (eligableQueenside
    && 
    board.isClearAlongRank(from, {rank, file: 'b'}) 
    &&
    !canBeCapturedAlongRank(board, from, {rank, file: 'b'}, piece.side)
  ) {
    positions.push({file: 'c', rank})
  }

  return positions
}


const resolve = (
  board: Board,
  move: Move,
  messageFn?: (s: string) => void
): Action | null => {
  
  if (legalMove(move)) {
    const fromSide = board.getOccupantSide(move.from)
    const toSide = board.getOccupantSide(move.to)
    if (!toSide) {
      return 'move'
    }
    else if (fromSide && toSide && (fromSide !== toSide)) {
      return 'capture'
    }
  }
  else if (amCastling(board, move, messageFn)) {
    return 'castle'
  }
  return null 
}

const resolvableMoves = (
  board: Board,
  piece: Piece,
  from: Position,
  ignoreCastling?: boolean // only relevant for king
): Resolution[] => {

  const positions = [] as Position[]

  if (hasN(from)) {
    const NRank = getNRank(from)
    positions.push({
      rank: NRank,
      file: from.file
    })
    if (hasE(from)) {
      positions.push({
        rank: NRank,
        file: getEFile(from)
      })
    }
    if (hasW(from)) {
      positions.push({
        rank: NRank,
        file: getWFile(from)
      })
    }
  }
  if (hasS(from)) {
    const SRank = getSRank(from)
    positions.push({
      rank: SRank,
      file: from.file
    })
    if (hasE(from)) {
      positions.push({
        rank: SRank,
        file: getEFile(from)
      })
    }
    if (hasW(from)) {
      positions.push({
        rank: SRank,
        file: getWFile(from)
      })
    }
  }
  if (hasE(from)) {
    positions.push({
      rank: from.rank,
      file: getEFile(from)
    })
  }
  if (hasW(from)) {
    positions.push({
      rank: from.rank,
      file: getWFile(from)
    })
  }

  const resolvable = [] as Resolution[]
  positions.forEach((pos) => {
    const toPiece = board.getOccupant(pos)
    if (!toPiece) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action: 'move'
      })
    }
    else if (isOpponent(toPiece, piece.side)) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action: 'capture'
      })
    }
  })

  if (!ignoreCastling) {
    const castleable = castlablePositions(board, piece, from)
    castleable.forEach((pos) => {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action: 'castle'
      })
    })
  }

  return resolvable
}

export default {resolve, resolvableMoves}
