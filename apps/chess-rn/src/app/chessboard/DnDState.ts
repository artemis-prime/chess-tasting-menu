import { 
  makeObservable, 
  observable, 
  action, 
  computed
} from 'mobx'

import { 
  type Position, 
  type Piece, 
  type ObsPieceRef
} from '@artemis-prime/chess-core'

import type Point from './Point'

interface DragState extends ObsPieceRef {
  offset: Point | null 
}

  // For use inside the DnD system
interface DnDStateInternal extends DragState {

  from: Position | null
  squareOver: Position | null

  setPiece: (piece: Piece) => void 
  setFrom: (from: Position) => void 
  setOffset: (pt: Point) => void
  setSquareOver: (p: Position | null) => void

  clear: () => void 
}

class DnDStateImpl implements DnDStateInternal {

  static currentInstance: DnDStateImpl | null = null 

  private _piece: Piece | null = null
  from: Position | null = null
  offset: Point | null = null
  squareOver: Position | null = null

  constructor() {
    makeObservable(this, {
      from: observable,
      offset: observable,
      setPiece: action,
      setFrom: action,
      setOffset: action,
      clear: action,
      piece: computed
    }) 
      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<DnDStateImpl, '_piece'>(this, {
      _piece: observable
    })
  }

  setPiece(piece: Piece) {
    this._piece = piece
  } 

  setFrom(from: Position) {
    this.from = from
  } 

  setOffset(pt: Point): void {
    this.offset = pt
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
    this.offset = null
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
  type DragState,  
  type DnDStateInternal
}
