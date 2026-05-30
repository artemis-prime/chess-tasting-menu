import type MoveType from './move-type'
import MoveRecord, { type HistoryMode } from './move-record'
import type Check from './check'
import type GameStatus from './game-status'
import type Move from './move' 
import type { Side }  from './piece' 

interface ChessListener {

  actionResolved(move: Move, action: MoveType | null): void
  actionTaken(r: MoveRecord, mode: HistoryMode): void   

  actionsRestored(recs: readonly MoveRecord[]): void

    // During resolution, there might be a message issued
    // from the core.
    // eg, "You can't castle because your king has moved!"
  messageSent(s: string, type?: string): void 

  inCheck(c: Check): void
  notInCheck(side: Side): void

  gameStatusChanged(s: GameStatus): void
}

export { type ChessListener as default }