import type { 
  Action, 
  Piece, 
  Position, 
  Side, 
  Rank,
  Move, 
  Resolution,
} from '../..'

import type Board from '../Board'

import { isOpponent } from '../../Piece'
import { FILES } from '../../Position'

const pawnOnHomeRow = (pos: Position, side: Side): boolean => (
  pos.rank === 2 && side === 'white'
  ||
  pos.rank === 7 && side === 'black'
)

const isMovingOneFileOver = (move: Move) => (
  Math.abs(FILES.indexOf(move.to.file) - FILES.indexOf(move.from.file)) === 1
)

const isGettingPromoted = (to: Position, side: Side): boolean => (
  (side === 'black' && to.rank  === 1) 
  || 
  (side === 'white' && to.rank  === 8)
)

const correctDistanceAndDirection = (
  move: Move,
  distanceToCheck: 1 | 2 = 1
) => {
  const distance = (move.piece.side === 'white') ? distanceToCheck : -distanceToCheck
  return (move.to.rank - move.from.rank) === distance
}

const isCapturing = (
  move: Move,
  toPiece: Piece | null 
): boolean => (

  isOpponent(toPiece, move.piece.side)
  &&
    // moving diagonally
  isMovingOneFileOver(move)
  &&
  correctDistanceAndDirection(move)    
) 

const isInitialTwoRankMove = (
  board: Board, 
  move: Move,
  toPiece: Piece | null
) : boolean => (

  !toPiece
  &&
  (move.from.file === move.to.file) 
  &&
  pawnOnHomeRow(move.from, move.piece.side)
  && 
  correctDistanceAndDirection(move, 2)    
  &&
  !board.getOccupant({
    file: move.from.file,
    rank: ((move.piece.side === 'white') ? move.from.rank + 1 : move.from.rank - 1) as Rank
  })
) 

const isOneRankMove = (
  move: Move,
  toPiece: Piece | null
) => (
  !toPiece
  &&
  (move.from.file === move.to.file) 
  &&
  correctDistanceAndDirection(move)    
)

const resolve = (
  board: Board, 
  move: Move,
  messageFn?: (s: string) => void
): Action | null => {
  
  const toPiece = board.getOccupant(move.to)

  if (isOneRankMove(move, toPiece)) {
    return isGettingPromoted(move.to, move.piece.side) ? 'promote' : 'move'
  }
  else if (isInitialTwoRankMove(board, move, toPiece)) {
    return 'move'
  }
  else if (isCapturing(move, toPiece)) {
    return isGettingPromoted(move.to, move.piece.side) ? 'capturePromote' : 'capture'
  }
  return null
}

const resolvableMoves = (
  board: Board,
  piece: Piece,
  from: Position,
  ignoreCastling?: boolean // only relevant for king
): Resolution[] => {
  
  const resolvable = [] as Resolution[]

  const onFileAtEdge = (direction: 'E' | 'W'): boolean => (
    from.file === (direction === 'E' ? 'a' : 'h')
  )

  const attackableSquares = (): Position[] => {
    const result = [] as Position[] 
      // No need to check edge since that would force a promotion and 
      // this pawn's code would never get called.
    const forwardRank = from.rank + ((piece.side === 'white') ? 1 : -1) as Rank
    if (!onFileAtEdge('E')) {
      result.push({file: FILES[FILES.indexOf(from.file) - 1], rank: forwardRank})
    }
    if (!onFileAtEdge('W')) {
      result.push({file: FILES[FILES.indexOf(from.file) + 1], rank: forwardRank})
    }
    return result
  }

  const squareInFront = {
    file: from.file,
    rank: from.rank + ((piece.side === 'white') ? 1 : -1) as Rank
  }

  if (!board.getOccupant(squareInFront)) {
    resolvable.push({
      move: {
        piece,
        from,
        to: squareInFront
      },
      action: isGettingPromoted(squareInFront, piece.side) ? 'promote' : 'move'
    })
    if (pawnOnHomeRow(from, piece.side)) {
      const squareTwoInFront = {
        file: from.file,
        rank: from.rank + ((piece.side === 'white') ? 2 : -2) as Rank
      }
      if (!board.getOccupant(squareTwoInFront)) {
        resolvable.push({
          move: {
            piece,
            from,
            to: squareTwoInFront
          },
          action: 'move'
        })
      }
    }
  }
  attackableSquares().forEach((pos) => {
    if (isOpponent(board.getOccupant(pos), piece.side)) {
      resolvable.push({
        move: {
          piece,
          from,
          to: pos
        },
        action:  isGettingPromoted(squareInFront, piece.side) ? 'capturePromote' : 'capture'
      })
    }
  })
  return resolvable
}

export default {resolve, resolvableMoves}
