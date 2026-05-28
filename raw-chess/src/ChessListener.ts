import type Action from './Action'
import ActionRecord, { type ActionMode } from './ActionRecord'
import type Check from './Check'
import type GameStatus from './GameStatus'
import type Move from './Move' 
import type { Side }  from './Piece' 

interface ChessListener {

  actionResolved(move: Move, action: Action | null): void
  actionTaken(r: ActionRecord, mode: ActionMode): void   

  actionsRestored(recs: readonly ActionRecord[]): void

    // During resolution, there might be a message issued
    // from the core.
    // eg, "You can't castle because your king has moved!"
  messageSent(s: string, type?: string): void 

  inCheck(c: Check): void
  notInCheck(side: Side): void

  gameStatusChanged(s: GameStatus): void
}

export { type ChessListener as default }