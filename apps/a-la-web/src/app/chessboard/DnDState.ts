import { makeObservable, observable, action, computed } from 'mobx'

import type { Piece, Position, ObsPieceRef } from '@artemis-prime/chess-core'

import type DnDPayload from './DnDPayload'

interface DnDStateInternal extends ObsPieceRef {

  from: Position | null
  squareOver: Position | null
  setPayload: (p: DnDPayload | null) => void 
  setSquareOver: (p: Position | null) => void
  clear: () => void 
}

class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  private _piece: Piece | null = null
  from: Position | null = null
  squareOver: Position | null = null

  constructor() {
    makeObservable(this, {
      from : observable,
      setPayload: action,
      clear: action,
      piece: computed
    }) 
      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<DnDStateImpl, '_piece'>(this, {
      _piece: observable
    })
      
  }

  setPayload(p: DnDPayload | null): void {
    this.from = p ? p.from : null
    this._piece = p ? p.piece : null
  }

  setSquareOver(p: Position | null): void {
    this.squareOver = p
  }

  get piece(): Piece | null {
    return this._piece
  }

  clear(): void {
    this._piece = null
    this.from = null
    this.squareOver = null
  }
}

const getDnDStateSingleton = (): DnDStateInternal => {
  if (!DnDStateImpl.currentInstance) {
    DnDStateImpl.currentInstance = new DnDStateImpl() 
  }
  return DnDStateImpl.currentInstance as DnDStateInternal
}

export {
  getDnDStateSingleton,
  type DnDStateInternal
}



