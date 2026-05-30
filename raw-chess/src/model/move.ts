import type Piece from './piece'
import { piecesEqual } from './piece'
import type Position from './position'
import { positionsEqual } from './position'

interface Move {
  readonly piece: Piece
  readonly from: Position
  readonly to: Position
}

const movesEqual = (m1: Move, m2: Move): boolean => (
  piecesEqual(m1.piece, m2.piece) &&
  positionsEqual(m1.from, m2.from) && 
  positionsEqual(m1.to, m2.to)
)

export { type Move as default, movesEqual }