import type MoveType from './move-type'
  
  // Possible 'status' a position could have in the current dnd
  // or current check. 
  // These are not used by the domain core, but are a convenience 
  // for apps so the UI can give feedback.
type SquareState = 
   MoveType |           // current square resolves to the MoveType
  'origin' |          // origin of the drag
  'invalid' |         // over this square, but no valid move
  'castleRookFrom' |  // action is 'castle' and this square is the rook's origin
  'castleRookTo' |    // action is 'castle' and this square is the rook's destination
  'none' |            // not involved in the current drag
  'kingInCheck' | 
  'inCheckFrom'


export { type SquareState as default }
