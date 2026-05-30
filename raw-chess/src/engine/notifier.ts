import type ChessListener from '../model/chess-listener'
import type MoveAttempt from '../model/move-attempt'
import type { Side }  from '../model/piece'
import MoveRecord, { type ApplyMode } from '../model/move-record'
import type GameStatus from '../model/game-status'
import type Check from '../model/check'

class Notifier implements ChessListener {

  private _listeners = new Map<string, ChessListener>()

  constructor() {}
  
  registerListener(l: ChessListener, uniqueId: string) {
    this._listeners.set(uniqueId, l)
  }

  unregisterListener(uniqueId: string) {
    this._listeners.delete(uniqueId)
  }

  moveTried(attempt: MoveAttempt): void {
    this._listeners.forEach((l) => {
      l.moveTried(attempt)
    })
  }

  moveApplied(record: MoveRecord, mode: ApplyMode): void {
    this._listeners.forEach((l) => {
      l.moveApplied(record, mode)
    })
  }

  movesRestored(records: readonly MoveRecord[]): void {
    this._listeners.forEach((l) => {
      l.movesRestored(records)
    })
  }

  messageSent(s: string, type?: string): void {
    this._listeners.forEach((l) => {
      l.messageSent(s, type)
    })
  }

  inCheck(c: Check): void {
    this._listeners.forEach((l) => {
      l.inCheck(c)
    })
  }
 
  notInCheck(side: Side): void {
    this._listeners.forEach((l) => {
      l.notInCheck(side)
    })
  }

  gameStatusChanged(s: GameStatus): void {
    this._listeners.forEach((l) => {
      l.gameStatusChanged(s)
    })
  }

}

export { Notifier as default }