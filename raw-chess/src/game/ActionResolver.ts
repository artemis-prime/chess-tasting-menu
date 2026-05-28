import { 
  type Action, 
  type Piece, 
  type Position, 
  type Move, 
  type Resolution,
} from '..'

import type Board from './Board' 

interface ActionResolver {

  resolve: ( 
    board: Board,
    move: Move, 
    messageFn?: (s: string) => void
  ) => Action | null

  resolvableMoves: (
    board: Board,
    piece: Piece, 
    from: Position,
    ignoreCastling?: boolean // only relevant for king
  ) => Resolution[]
}

export { type ActionResolver as default }  
