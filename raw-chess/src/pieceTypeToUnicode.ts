import type { PieceType } from './Piece'

export default {
  king: '\u265A',
  queen: '\u265B',
  rook: '\u265C',
  bishop: '\u265D',
  knight: '\u265E',
  pawn: '\u265F',
} as {[key in PieceType]: string}