import { 
  type MoveType, 
  type Piece, 
  type Position, 
  type Move, 
  type LegalMove,
} from '..'

import type Board from './board' 

interface MoveRule {

  legalAs: ( 
    board: Board,
    move: Move, 
    messageFn?: (s: string) => void
  ) => MoveType | null

  legalMoves: (
    board: Board,
    piece: Piece, 
    from: Position,
    ignoreCastling?: boolean // only relevant for king
  ) => LegalMove[]
}

export { type MoveRule as default }  
