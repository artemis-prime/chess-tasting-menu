import type MoveAttempt from './move-attempt'
import MoveRecord, { type ApplyMode } from './move-record'
import type Check from './check'
import type GameStatus from './game-status'
import type { Side }  from './piece'

interface ChessListener {

  moveTried(attempt: MoveAttempt): void
  moveApplied(record: MoveRecord, mode: ApplyMode): void

  movesRestored(records: readonly MoveRecord[]): void

    // While a move is being tried, the core may issue a message.
    // eg, "You can't castle because your king has moved!"
  messageSent(s: string, type?: string): void

  inCheck(c: Check): void
  notInCheck(side: Side): void

  gameStatusChanged(s: GameStatus): void
}

export { type ChessListener as default }
