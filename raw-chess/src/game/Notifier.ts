import type ChessListener from '../ChessListener'
import type Action from '../Action'
import type { Side }  from '../Piece' 
import type Move from '../Move' 
import ActionRecord, { type ActionMode } from '../ActionRecord'
import type GameStatus from '../GameStatus'
import type Check from '../Check'

class Notifier implements ChessListener {

  private _listeners = new Map<string, ChessListener>()

  constructor() {}
  
  registerListener(l: ChessListener, uniqueId: string) {
    this._listeners.set(uniqueId, l)
  }

  unregisterListener(uniqueId: string) {
    this._listeners.delete(uniqueId)
  }

  actionResolved(move: Move, action: Action | null): void {
    this._listeners.forEach((l) => {
      l.actionResolved(move, action)
    })
  }

  actionTaken(r: ActionRecord, mode: ActionMode): void {
    this._listeners.forEach((l) => {
      l.actionTaken(r, mode)
    })
  }

  actionsRestored(recs: readonly ActionRecord[]): void {
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