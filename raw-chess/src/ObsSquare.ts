import type ObsPieceRef from './ObsPieceRef'
import type ObsSquareStateRef from './ObsSquareStateRef'
import type Position from './Position'

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