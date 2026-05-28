import Square from '../Square'

import { 
  type PieceType,
  type PieceCode, 
  pieceFromCodeString,
  pieceToString,
  isPrimaryType,
} from '../../Piece'

import { 
  type File, 
  type PositionCode,
  positionToString, 
  RANKS, 
  FILES 
} from '../../Position'
import type Snapshotable from '../../Snapshotable'
import type Tracking from './Tracking'

const INITIAL_HOME_RANK = {
  'a': 'rook',
  'b': 'knight',
  'c': 'bishop',
  'd': 'queen',
  'e': 'king',
  'f': 'bishop',
  'g': 'knight',
  'h': 'rook',
} as {
  [key in File]: PieceType
}

  // Call only for Squares that contains a piece
const trackAsReset = (tr: Tracking, sq: Square): void => {
  const side = sq.occupant!.side
  tr[side].trackAsReset(sq.occupant!, sq)
}

type RankSquares = {
  [key in File]: Square
}

const rankSquaresFromArray = (sqs: Square[]): RankSquares => {
  
  if (sqs.length !== 8) {
    throw new Error('rankSquaresFromArray(): array of Squares must contain exactly 8 elements!')
  }
  return {
    a: sqs[0],
    b: sqs[1],
    c: sqs[2],
    d: sqs[3],
    e: sqs[4],
    f: sqs[5],
    g: sqs[6],
    h: sqs[7],
  }
}

const deepCopyRankSquares = (rs: RankSquares): RankSquares => {
  const squares = Object.values(rs)
  const rankArray: Square[] = []
  for (const square of squares) {
    rankArray.push(square.clone()) 
  }
  return rankSquaresFromArray(rankArray)
}

  // Only squares with pieces get a key.
  // (if absent, the corresponding square is simple empty)
type SquaresSnapshot = {
  [key in PositionCode]?: PieceCode 
}

class BoardSquares implements Snapshotable<SquaresSnapshot>{

  1: RankSquares
  2: RankSquares
  3: RankSquares
  4: RankSquares
  5: RankSquares
  6: RankSquares
  7: RankSquares
  8: RankSquares

  static visitAsNewGame(sq: Square, tr: Tracking, assignState = true): void {
    if (sq.rank === 1) {
      sq.setOccupant({ type: INITIAL_HOME_RANK[sq.file], side: 'white' })
      trackAsReset(tr, sq)
    }
    else if (sq.rank === 2) {
      sq.setOccupant({ type: 'pawn', side: 'white' })
    }
    else if (sq.rank === 8) {
      sq.setOccupant({ type: INITIAL_HOME_RANK[sq.file], side: 'black' })
      trackAsReset(tr, sq)
    }
    else if (sq.rank === 7) {
      sq.setOccupant({ type: 'pawn', side: 'black' })
    }
    else {
      sq.setOccupant(null)
    }
    if (assignState) {
      sq.setSquareState('none')
    }
  }

    // Intentionally forgiving. If a key corresponding to a
    // square is found and its value successfully parsed, a piece is placed there. 
    // If not, the square is empty (no Errors are ever thrown)
  static visitWithSnapshot(sq: Square, snapshot: SquaresSnapshot, tracking?: Tracking): void {
    const keyToTry = positionToString(sq) as PositionCode
    if (snapshot[keyToTry]) {
        // If pieceFromCodeString is undefined, default to null
      const occupant = pieceFromCodeString(snapshot[keyToTry]!)
      sq.setOccupant(occupant ?? null) 
      if (tracking && occupant && (isPrimaryType(occupant.type) || occupant.type === 'king')) {
        tracking[occupant.side].trackAsRestore(occupant, sq)
      }
    }
    else {
      sq.setOccupant(null)
    }
    sq.setSquareState('none')
  }

  constructor (tr: Tracking, observePieces? : boolean) {
    for (const rank of RANKS) {
      const sqs: Square[] = []
      for (const file of FILES) {
        const sq = new Square(rank, file, null, 'none', observePieces)  
        BoardSquares.visitAsNewGame(sq, tr, false)
        sqs.push(sq)
      }
      this[rank] = rankSquaresFromArray(sqs)
    } 
  }

  reset(tr: Tracking) {
    for (const rank of RANKS) {
      for (const file of FILES) {
        BoardSquares.visitAsNewGame(this[rank][file], tr)
      }
    }
  }
 
  takeSnapshot(): SquaresSnapshot {
    const snapshot: SquaresSnapshot = {}
    for (const rank of RANKS) {
      for (const file of FILES) {
        if (this[rank][file].occupant) {
          snapshot[`${file}${rank}`] = pieceToString(this[rank][file].occupant!) as PieceCode
        }
      }
    }
    return snapshot
  }

  restoreFromSnapshot(snapshot: SquaresSnapshot, tracking?: Tracking): void {

    for (const rank of RANKS) {
      for (const file of FILES) {
        BoardSquares.visitWithSnapshot(this[rank][file], snapshot, tracking)
      }
    }
  }

  syncTo(source: BoardSquares): void {
    for (const rank of RANKS) {
      this[rank] = deepCopyRankSquares(source[rank])
    }
  }
} 

export {
  BoardSquares as default,
  type SquaresSnapshot
}
