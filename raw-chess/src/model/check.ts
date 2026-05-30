import type { Side } from './piece'
import type Position from './position'

interface Check {
  side: Side,
  from: Position[],
  kingPosition: Position 
}

export type { Check as default } 
