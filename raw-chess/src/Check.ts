import type { Side } from './Piece'
import type Position from './Position'

interface Check {
  side: Side,
  from: Position[],
  kingPosition: Position 
}

export type { Check as default } 
