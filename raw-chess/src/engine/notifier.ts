import type ChessListener from '../model/chess-listener'
import type MoveType from '../model/move-type'
import type { Side }  from '../model/piece' 
import type Move from '../model/move' 
import MoveRecord, { type HistoryMode } from '../model/move-record'
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

  actionResolved(move: Move, action: MoveType | null): void {
    this._listeners.forEach((l) => {
      l.actionResolved(move, action)
    })
  }

  actionTaken(r: MoveRecord, mode: HistoryMode): void {
    this._listeners.forEach((l) => {
      l.actionTaken(r, mode)
    })
  }

  actionsRestored(recs: readonly MoveRecord[]): void {
    this._listeners.forEach((l) => {
      l.actionsRestored(recs)
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