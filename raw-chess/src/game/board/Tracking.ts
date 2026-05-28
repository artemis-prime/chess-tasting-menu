import { makeObservable, observable, action } from 'mobx'

import type { ActionMode } from '../../ActionRecord'
import type CastlingTracking from '../../CastlingTracking'
import type Move from '../../Move'
import type Position from '../../Position'
import type Piece from '../../Piece'
import { 
  isPrimaryType, 
  type PrimaryPieceType, 
  type Side, 
  type RookSide
} from '../../Piece'
import { 
  positionFromString, 
  positionsEqual, 
  positionToString, 
  type Rank, 
  type PositionCode 
} from '../../Position'
import type Snapshotable from '../../Snapshotable'

interface TrackingForSideSnapshot {
  king: PositionCode,
  primaries: {
    queen: PositionCode[] // there may be more than none due to promotion
    bishop: PositionCode[]
    knight: PositionCode[]
    rook: {
      kingside: {
        position: PositionCode | null,
        capturePos: PositionCode | null
      }
      queenside: {
        position: PositionCode | null,
        capturePos: PositionCode | null
      }
    }
  }
  inCheckFrom: PositionCode[]
  castling: CastlingTracking
}

interface TrackingSnapshot {
  white: TrackingForSideSnapshot
  black: TrackingForSideSnapshot
}

class CastlingTrackingInternal 
  implements CastlingTracking, 
  Snapshotable<CastlingTracking> 
{

  hasCastled: boolean = false
  kingMoveCount: number = 0
  rookMoveCounts = {
    kingside: 0,
    queenside: 0
  }

  constructor() {}

  reset() {
    this.hasCastled = false
    this.kingMoveCount = 0
    this.rookMoveCounts = {
      kingside: 0,
      queenside: 0
    }
  }

  syncTo(source: CastlingTrackingInternal) {
    this.hasCastled = source.hasCastled 
    this.kingMoveCount = source.kingMoveCount 
    this.rookMoveCounts = {...source.rookMoveCounts} 
  }

  restoreFromSnapshot(snapshot: CastlingTracking): void {
    this.hasCastled = snapshot.hasCastled
    this.kingMoveCount = snapshot.kingMoveCount
    this.rookMoveCounts.kingside = snapshot.rookMoveCounts.kingside
    this.rookMoveCounts.queenside = snapshot.rookMoveCounts.queenside
  }

  takeSnapshot(): CastlingTracking {
    return ({
      ...this,
      rookMoveCounts: {
        ...this.rookMoveCounts
      }
    }) 
  }
}

type PrimariesTrackedAsArrays = 'queen' | 'knight' | 'bishop'

  // position is null if it's been captured,
  // in which case capturePos will be populated.
  // This is needed to restore proper tracking
  // after an undo of a capture
type RookTracking = {
  position: Position | null
  capturePos: Position | undefined 
}
class TrackingForSide implements Snapshotable<TrackingForSideSnapshot> {

  king: Position

  private primaries: {
    queen: Position[]
    bishop: Position[]
    knight: Position[]
    rook: {
      kingside: RookTracking
      queenside: RookTracking
    }
  }

  inCheckFrom: Position[] = []
  castling: CastlingTrackingInternal

  constructor(side: Side, _observable?: boolean ) {

    const rank = (side === 'white') ? 1 : 8 as Rank
    this.king = { rank, file: 'e' }

    this.primaries = {
      queen: [],
      bishop: [],
      knight: [],
      rook: {
        kingside: { 
          position: { rank, file: 'h'},
          capturePos: undefined
        },
        queenside: { 
          position: { rank, file: 'a'},
          capturePos: undefined
        }
      }
    }

    if (_observable) {
      makeObservable(this, {
        inCheckFrom: observable,
        reset: action,
        restoreFromSnapshot: action
      })
    }
    this.castling = new CastlingTrackingInternal()
  }

  reset(side: Side): void {
    const rank = (side === 'white') ? 1 : 8 as Rank
    this.king = { rank, file: 'e' }
    this.primaries = {
      queen: [],
      bishop: [],
      knight: [],
      rook: {
        kingside: { 
          position: { rank, file: 'h'},
          capturePos: undefined
        },
        queenside: { 
          position: { rank, file: 'a'},
          capturePos: undefined
        }
      }
    }

    this.inCheckFrom.length = 0
    this.castling.reset()
  }

  clearRookTracking(): void {
    this.primaries.rook.kingside.position = null
    this.primaries.rook.kingside.capturePos = undefined
    this.primaries.rook.queenside.position = null
    this.primaries.rook.queenside.capturePos = undefined
  }

  takeSnapshot(): TrackingForSideSnapshot {
    return {
      king: positionToString(this.king),
      primaries: {
        queen: this.primaries.queen.map((pos) => (positionToString(pos))),
        bishop: this.primaries.bishop.map((pos) => (positionToString(pos))),
        knight: this.primaries.knight.map((pos) => (positionToString(pos))),
        rook: {
          kingside: {
            position: this.primaries.rook.kingside.position ? positionToString(this.primaries.rook.kingside.position) : null,
            capturePos: this.primaries.rook.kingside.capturePos ? positionToString(this.primaries.rook.kingside.capturePos) : null,
          },
          queenside: {
            position: this.primaries.rook.queenside.position ? positionToString(this.primaries.rook.queenside.position) : null,
            capturePos: this.primaries.rook.queenside.capturePos ? positionToString(this.primaries.rook.queenside.capturePos) : null,
          }
        }
      },
      inCheckFrom: this.inCheckFrom.map((pos) => (positionToString(pos))),
      castling: this.castling.takeSnapshot()
    }
  }

  restoreFromSnapshot(snapshot: TrackingForSideSnapshot): void {
    this.king = positionFromString(snapshot.king)!
    this.primaries = {
      queen: snapshot.primaries.queen.map((e) => (positionFromString(e)!)),
      bishop: snapshot.primaries.bishop.map((e) => (positionFromString(e)!)),
      knight: snapshot.primaries.knight.map((e) => (positionFromString(e)!)),
      rook: {
        kingside: {
          position: positionFromString(snapshot.primaries.rook.kingside.position) ?? null,
          capturePos: positionFromString(snapshot.primaries.rook.kingside.capturePos) ?? undefined
        },
        queenside: {
          position: positionFromString(snapshot.primaries.rook.queenside.position) ?? null,
          capturePos: positionFromString(snapshot.primaries.rook.queenside.capturePos) ?? undefined
        }
      }
    }

      // Maintain array ref (do not assign a new via map())
      // to preserve mobx proxy
    this.inCheckFrom.length = 0
    snapshot.inCheckFrom.forEach((el) => {
        // we know the source of the strings, so safe
      this.inCheckFrom.push(positionFromString(el)!)
    })
    this.castling.restoreFromSnapshot(snapshot.castling)
  }


    // Note, the source object may have observable components, but
    // this object won't.  We will *always* only sync from observable to non-observable
    // https://mobx.js.org/observable-state.html#converting-observables-back-to-vanilla-javascript-collections
  syncTo (source: TrackingForSide) {
    this.king = source.king
    this.primaries = {
      queen: [...source.primaries.queen],
      bishop: [...source.primaries.bishop],
      knight: [...source.primaries.knight],
      rook: {
        kingside: {
          position: source.primaries.rook.kingside.position,
          capturePos: source.primaries.rook.kingside.capturePos
        },
        queenside: {
          position: source.primaries.rook.queenside.position,
          capturePos: source.primaries.rook.queenside.capturePos
        }
      }
    }
    this.inCheckFrom = source.inCheckFrom.slice() 
    this.castling.syncTo(source.castling)
  }
    // called when pos contains a rook
  private _rookSideFromPosition(pos: Position): RookSide {
    const { kingside, queenside } = this.primaries.rook
    if (kingside.position && positionsEqual(pos, kingside.position)) {
      return 'kingside'
    }
    else if (queenside.position && positionsEqual(pos, queenside.position)) {
      return 'queenside'
    }
    throw new Error( "Tracking._rookSideFromPosition(): could not determin rook side from position!")
  }

  private _rookSideFromCapturePos(pos: Position): RookSide {
    const { kingside, queenside } = this.primaries.rook
    if (kingside.capturePos && positionsEqual(pos, kingside.capturePos)) {
      return 'kingside'
    }
    else if (queenside.capturePos && positionsEqual(pos, queenside.capturePos)) {
      return 'queenside'
    }
    throw new Error( "Tracking._rookSideFromCapturePos(): could not determin rook side from position!")
  }
  

  getPrimaryTypePositions(t: PrimaryPieceType): Position[] {
    if (t === 'rook') {
      const rookPositions: Position [] = []
      if (this.primaries.rook.kingside.position) {
        rookPositions.push(this.primaries.rook.kingside.position)  
      }
      if (this.primaries.rook.queenside.position) {
        rookPositions.push(this.primaries.rook.queenside.position)  
      }
      return rookPositions
    }
    return [...this.primaries[t]]
  }

  getRookTracking(rookSide: RookSide): RookTracking {
    return this.primaries.rook[rookSide]
  }

  trackPositionChange(m: Move, mode: ActionMode): void {
    if (m.piece.type === 'king') {
      if (mode === 'undo') {
        this.king = m.from
        if (!this.castling.hasCastled) {
          this.castling.kingMoveCount -= 1
        }
      }
      else {
        this.king = m.to
        if (!this.castling.hasCastled) {
          this.castling.kingMoveCount += 1
        }
      }
    }
    else if (isPrimaryType(m.piece.type)) {
      if (m.piece.type === 'rook' ) {
        if (mode === 'undo') {
          const rookSide = this._rookSideFromPosition(m.to)
          this.primaries.rook[rookSide].position = m.from
          if (!this.castling.hasCastled) {
            this.castling.rookMoveCounts[rookSide] -= 1
          }
        }
        else {
          const rookSide = this._rookSideFromPosition(m.from)
          this.primaries.rook[rookSide].position = m.to
          if (!this.castling.hasCastled) {
            this.castling.rookMoveCounts[rookSide] += 1
          }
        }
      }
      else {
        const positions = this.primaries[m.piece.type as PrimariesTrackedAsArrays]
        if (mode === 'undo') {
          const index = positions.findIndex((p) => (positionsEqual(p, m.to)))
          if (index !== -1) {
            positions[index] = m.from
          }
        }
        else {
          const index = positions.findIndex((p) => (positionsEqual(p, m.from)))
          if (index !== -1) {
            positions[index] = m.to
          }
        }
      }
    }
  }

  trackCapture(piece: Piece, pos: Position, mode: ActionMode): void {

    if (!isPrimaryType(piece.type)) return; 

    if (piece.type === 'rook' ) {
      if (mode === 'undo') {
        const rookSide = this._rookSideFromCapturePos(pos)
        this.primaries.rook[rookSide].position = pos
        this.primaries.rook[rookSide].capturePos = undefined
      }
      else {
        const rookSide = this._rookSideFromPosition(pos)
        this.primaries.rook[rookSide].position = null
        this.primaries.rook[rookSide].capturePos = pos
      }
    }
    else {
      const positions = this.primaries[piece.type as PrimariesTrackedAsArrays]
      const index = positions.findIndex((e) => (positionsEqual(e, pos)))
      if (mode === 'undo') {
          // shouldn't find it, since we're undoing a capture
        if (index === -1) {
          positions.push(pos)
        }
      }
      else {
        if (index !== -1) {
          positions.splice(index, 1)
        }
      }
    }
  }

  trackPromotion(pos: Position, mode: ActionMode ) {
      // Track the new piece of the promoted to type.
      // Either create a new slot of it with the to square,
      // or destroy said slot if undo
    const positions = this.primaries.queen
    if (mode === 'undo') {
        // remove the slot created for the piece promoted to. 
      const index = positions.findIndex((e) => (positionsEqual(e, pos)))
      if (index !== -1) {
        positions.splice(index, 1)
      }
    } 
    else {
      // create another slot for the piece type promoted to.
      // (from piece was type 'pawn', so ignore)
      positions.push(pos)
    } 
   
  }

  trackCastle(m: Move, mode: ActionMode): void {
      // castling does not effect the move counts for king and rooks
    if (mode === 'undo') {
      this.king = m.from
      this.castling.hasCastled = false
    }
    else {
      this.king = m.to
      this.castling.hasCastled = true
    }

      /****  
        // Now, on to tracking the rook involved...
        // Note that m.to is the *king's* 'to'!
        // This is the castling logic...
        if (K: e --> g) {
           R: h --> f
        }
          // K: e --> c
        else {
          R: a --> d
        }
      ****/
    const rank = m.from.rank
    let rook: {
      rookSide: RookSide
      from: Position
      to: Position
    } 
    if (m.to.file === 'g') {
      rook = {
        rookSide: 'kingside',
        from: {rank, file: 'h'},
        to: {rank, file: 'f'}
      }
    }
    else {
      rook = {
        rookSide: 'queenside',
        from: {rank, file: 'a'},
        to: {rank, file: 'd'}
      }
    }
    if (mode === 'undo') {
      this.primaries.rook[rook.rookSide].position = rook.from
    }
    else {
      this.primaries.rook[rook.rookSide].position = rook.to
    }
  }

  trackAsReset(piece: Piece, pos: Position): void {
      // king and rook are initialized in constructor() and during reset()
    if (piece.type !== 'king' && piece.type !== 'rook') {
      const positions = this.primaries[piece.type as PrimariesTrackedAsArrays]
      positions.push(pos)  
    }
  }

  trackAsRestore(piece: Piece, pos: Position): void {
    if (piece.type === 'king') {
      this.king = pos
    }
    else if (piece.type === 'rook') {
        // This is totally arbitrary, so we loose the actual castle tracking
        // In practice this is ok, since the "no tracking" persistence files
        // will only be created by hand, and used for debugging and testing
        // endgame conditions / features. 
      if (!this.primaries.rook.kingside.position) {
        this.primaries.rook.kingside.position = pos
        this.primaries.rook.kingside.capturePos = undefined  
      }
      else {
        this.primaries.rook.queenside.position = pos
        this.primaries.rook.queenside.capturePos = undefined  
      }
    }
    else {
      const positions = this.primaries[piece.type as PrimariesTrackedAsArrays]
      positions.push(pos)  
    }
  }
}

class Tracking implements Snapshotable<TrackingSnapshot>{

  white: TrackingForSide
  black: TrackingForSide


  constructor(observeMe?: boolean) {
    this.white = new TrackingForSide('white', observeMe)
    this.black = new TrackingForSide('black', observeMe)
  }

  reset() {
    this.white.reset('white')
    this.black.reset('black')
  }

  syncTo (source: Tracking) {
    this.white.syncTo(source.white)
    this.black.syncTo(source.black)
  }

  takeSnapshot(): TrackingSnapshot {
    return {
      white: this.white.takeSnapshot(),  
      black: this.black.takeSnapshot(),  
    }
  }

  restoreFromSnapshot(snapshot: TrackingSnapshot): void {
    this.white.restoreFromSnapshot(snapshot.white)
    this.black.restoreFromSnapshot(snapshot.black)
  }
}

export {
  Tracking as default,
  type TrackingSnapshot
}
