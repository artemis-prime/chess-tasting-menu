import type ObsPieceRef from './obs-piece-ref'
import type ObsSquareStateRef from './obs-square-state-ref'
import type Position from '../position'

  // A read-only facade to the internal Square.
  // The rendering components are meant to make use of these.
  // It's an (immutable) Position plus two observable references:
  // one for Piece and one for SquareState.  
  // 
  // (That way, impl of board internals stays hidden and encapsulated, 
  // while dereferencing of observables is forced into 
  // the correct observer.)
interface ObsSquare extends Position, ObsPieceRef, ObsSquareStateRef {

}

export { type ObsSquare as default }