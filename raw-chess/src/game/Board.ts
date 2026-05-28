import {
  action,
  computed,
  makeObservable, 
} from 'mobx'

import ActionRecord, { type ActionMode } from '../ActionRecord'
import type Check from '../Check'
import { 
  type default as Piece, 
  type PrimaryPieceType, 
  type Side, 
  type RookSide,
  otherSide,
  isOpponent,
} from '../Piece'

import type Position from '../Position'
import { 
  RANKS,
  RANKS_REVERSED,
  FILES,
  type Rank,
} from '../Position'

import type Snapshotable from '../Snapshotable'
import Square from './Square'
import type ObsSquare from '../ObsSquare'

import {
  hasN,
  hasS,
  hasE,
  hasW,
  getNRank,
  getSRank,
  getEFile,
  getWFile,
} from './util'

import type IsCaptureFn from './IsCaptureFn'

import Tracking, { type TrackingSnapshot } from './board/Tracking'
import BoardSquares, { type SquaresSnapshot } from './board/BoardSquares'

interface Board {

  getOccupant(pos: Position): Piece | null
  getOccupantSide(pos: Position): Side | null 
  positionCanBeCaptured(pos: Position, captured: Side): boolean 
  
  eligableToCastle(side: Side, castleSide: RookSide): boolean   
  cannotCastleBecause(side: Side, castleSide: RookSide): string | null // returns reason or null if ok 

  isClearAlongRank(from: Position, to: Position): boolean
  isClearAlongFile(from: Position, to: Position): boolean
  isClearAlongDiagonal(from: Position, to: Position): boolean
}

interface BoardSnapshot {
  squares: SquaresSnapshot
  tracking: TrackingSnapshot | null
}

  // This interface is visable to GameImpl, but not to any UI
interface BoardInternal extends Board, Snapshotable<BoardSnapshot> {

  applyAction(r: ActionRecord, mode: ActionMode): void 

  takeSnapshot(): BoardSnapshot,
  restoreFromSnapshot(board: BoardSnapshot): void

  syncTo(other: BoardInternal): void 

  primaryPositions(side: Side, type: PrimaryPieceType): Position[]
  pawnPositions(side: Side): Position[] 

  get check(): Check | null // observable

  kingPosition(side: Side): Position
  reset(isObservable? : boolean): void

  // Utility methods for easy traversing / rendering (mobx 'computed')
  get asSquares():  Square[]
  get asSquareDescs():  ObsSquare[]

}

class BoardImpl implements BoardInternal {

  private _isCapture: IsCaptureFn

  private _tracking: Tracking 
  private _squares: BoardSquares 
  private _asSquareArray: Square[]

  constructor(f: IsCaptureFn, isObservable?: boolean) {

    this._isCapture = f
    if (isObservable) {

      makeObservable(this, {
        applyAction: action,
        reset: action,
        check: computed,
      })
    }
    this._tracking = new Tracking(isObservable)
    this._squares = new BoardSquares(this._tracking, isObservable)
    this._asSquareArray = []
    for (const rank of RANKS_REVERSED) {
      for (const file of FILES) {
        this._asSquareArray.push(this._squares[rank][file]) 
      }
    }

  }

  get asSquares(): Square[] {
    return this._asSquareArray
  }

  get asSquareDescs(): ObsSquare[] {
    return this._asSquareArray as ObsSquare[]
  }

  syncTo(other: BoardInternal): void {
    const theOther = other as BoardImpl
    this._squares.syncTo(theOther._squares) 
    this._tracking.syncTo(theOther._tracking) 
  }

  getOccupant(pos: Position): Piece | null {
    return this._sq(pos).occupant
  }
 
  getOccupantSide(pos: Position): Side | null {
    if (this._sq(pos).occupant) {
      return this._sq(pos).occupant!.side
    }
    return null
  }

  primaryPositions(side: Side, type: PrimaryPieceType): Position[] {
    return [...this._tracking[side].getPrimaryTypePositions(type) ]
  }

  pawnPositions(side: Side): Position[] {
    
    const result = [] as Position[]
    const visit = (sq: Square): void => {
      if (sq.occupant && sq.occupant.side === side && sq.occupant.type === 'pawn') {
        result.push(sq)
      } 
    }
    for (const rank of RANKS) {
      for (const file of FILES) {
        visit(this._squares[rank][file])
      }
    }
    return result
  }

  get check(): Check | null  {
    if (this._tracking.white.inCheckFrom.length > 0) {
      return {
        side: 'white',
        from: [...this._tracking.white.inCheckFrom],
        kingPosition: this._tracking.white.king
      }
    } 
    else if (this._tracking.black.inCheckFrom.length > 0) {
      return {
        side: 'black',
        from: [...this._tracking.black.inCheckFrom],
        kingPosition: this._tracking.black.king
      }
    }
    return null  
  }

  kingPosition(side: Side): Position {
    return this._tracking[side].king
  }

  isClearAlongRank(from: Position, to: Position): boolean {

    if (from.rank === to.rank) {
      const delta = FILES.indexOf(to.file) - FILES.indexOf(from.file)
      if (delta < 0) {
          // zero based!
        for (let fileIndex = FILES.indexOf(from.file) - 1; fileIndex > FILES.indexOf(to.file); fileIndex--) {
          if (!!this._squares[to.rank][FILES[fileIndex]].occupant) {
            return false
          }
        }
      }
      else {
          // zero based!
        for (let fileIndex = FILES.indexOf(from.file) + 1; fileIndex < FILES.indexOf(to.file); fileIndex++) {
          if (!!this._squares[to.rank][FILES[fileIndex]].occupant) {
            return false
          }
        }
      }
      return true
    }
    return false
  }
  
  isClearAlongFile(from: Position,  to: Position): boolean {

    if (FILES.indexOf(from.file) === FILES.indexOf(to.file)) {
      const delta = to.rank - from.rank
      if (delta < 0) {
          // one-based
        for (let rank = from.rank - 1; rank > to.rank; rank--) {
          if (!!this._squares[rank as Rank][from.file].occupant) {
            return false
          }
        }
      }
      else {
          // one-based
        for (let rank = from.rank + 1; rank < to.rank; rank++) {
          if (!!this._squares[rank as Rank][from.file].occupant) {
            return false
          }
        }
      }
      return true
    }
    return false
  }
  
  isClearAlongDiagonal(from: Position, to: Position): boolean {
  
    const deltaRank = to.rank - from.rank
    const deltaFile = FILES.indexOf(to.file) - FILES.indexOf(from.file)
  
    if (Math.abs(deltaRank) !== Math.abs(deltaFile)) {
      return false
    }
  
      // --> NE
    if (deltaFile > 0 && deltaRank > 0 ) {
      for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) + 1; rank < to.rank && fileIndex < FILES.indexOf(to.file); rank++, fileIndex++) {
        if (!!this._squares[rank as Rank][FILES[fileIndex]].occupant) {
          return false
        }
      }
    }
      // --> SE
    else if (deltaFile > 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) + 1; rank > to.rank && fileIndex < FILES.indexOf(to.file); rank--, fileIndex++) {
        if (!!this._squares[rank as Rank][FILES[fileIndex]].occupant) {
          return false
        }
      }
    }
      // --> SW
    else if (deltaFile < 0 && deltaRank < 0) {
      for (let rank = from.rank - 1, fileIndex = FILES.indexOf(from.file) - 1; rank > to.rank && fileIndex > FILES.indexOf(to.file);  rank--, fileIndex--) {
        if (!!this._squares[rank as Rank][FILES[fileIndex]].occupant) {
          return false
        }
      }
    }
      // --> NW
      else if (deltaFile < 0 && deltaRank > 0) {
        for (let rank = from.rank + 1, fileIndex = FILES.indexOf(from.file) - 1; rank < to.rank && fileIndex > FILES.indexOf(to.file); rank++, fileIndex--) {
          if (!!this._squares[rank as Rank][FILES[fileIndex]].occupant) {
            return false
          }
        }
      }
    return true
  }

  cannotCastleBecause = (side: Side, castleSide: RookSide): string | null => {
    const { inCheckFrom, castling: {hasCastled, kingMoveCount, rookMoveCounts} } = this._tracking[side]
    const rookTracking = this._tracking[side].getRookTracking(castleSide)
    const inCheck = inCheckFrom.length > 0
      // has been captured or has moved 
    const rookHasMoved = rookMoveCounts[castleSide] > 0 
    const rookHasBeenCaptured = rookTracking.position === null
    const kingHasMoved = kingMoveCount > 0
    
    const eligable = !inCheck && !hasCastled && !kingHasMoved && !rookHasMoved && !rookHasBeenCaptured

    if (!eligable) {
      return (inCheck ? 
        `${side} cannot castle out of check!` 
        : 
        `${side} is not eligable to castle ${((kingHasMoved || hasCastled) ?  '' : castleSide + ' ')}because ` + 
        ((hasCastled) ? 'it has already castled!' : 
          (kingHasMoved ? 'the king has already moved!' : 
            (rookHasBeenCaptured ? 'that rook has been captured!' : 'that rook has already moved!')))) 
    }  
    return null
  }

  eligableToCastle = (side: Side, castleSide: RookSide): boolean => {
    return !(!!this.cannotCastleBecause(side, castleSide))
  }

  positionCanBeCaptured(pos: Position, asSide: Side): boolean {
    return this._positionCanBeCapturedFrom(pos, asSide, 'boolean') as boolean
  }

  applyAction(r: ActionRecord, mode: ActionMode): void {

    if (r.action === 'castle') {
      this._castle(r, mode)
    }
    else if (mode === 'undo') {
      this._move(r.move.to, r.move.from)
      if (r.action.includes('capture')) {
        this._sq(r.move.to).occupant = r.captured!
      }
      if (r.action.includes('romote')) {
          // the _move above just returned the piece to 'from'
        const self = this._sq(r.move.from).occupant!
        this._sq(r.move.from).occupant = {side: self.side, type: 'pawn'}
      }
    }
    else {
        // Note that _move also takes care of capture ;)
      this._move(r.move.from, r.move.to)
      if (r.action.includes('romote')) {
        const self = this._sq(r.move.to).occupant!
        this._sq(r.move.to).occupant = {side: self.side, type: 'queen'}
      }
    }

    this._track(r, mode)
      // Track inCheck for both, since various codepaths can result in 
      // either side being in check.
    this._trackInCheck('black')
    this._trackInCheck('white')
  }

  reset(): void {
    this._tracking.reset()
    this._squares.reset(this._tracking)
  }

  restoreFromSnapshot(snapshot: BoardSnapshot): void {

    this._tracking.reset()
    if (!snapshot.tracking) {
      this._tracking['white'].clearRookTracking()
      this._tracking['black'].clearRookTracking()
      this._squares.restoreFromSnapshot(snapshot.squares, this._tracking)
      this._trackInCheck('black')
      this._trackInCheck('white')
    }
    else {
      this._squares.restoreFromSnapshot(snapshot.squares)
      this._tracking.restoreFromSnapshot(snapshot.tracking)
    }
  }

  takeSnapshot(): BoardSnapshot {
    return {
      squares: this._squares.takeSnapshot(),
      tracking: this._tracking.takeSnapshot()
    }
  }
 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  private _sq(p: Position): Square {
    return this._squares[p.rank][p.file]!
  }

  private _sideIsInCheckFrom(side: Side): Position[] {
    return this._positionCanBeCapturedFrom(
      this._tracking[side].king,
      side,
      'positions'
    ) as Position[]
  }

  private _trackInCheck(side: Side): void {
    this._tracking[side].inCheckFrom = this._sideIsInCheckFrom(side)
  }

  private _move(from: Position, to: Position, ignoreCastling?: boolean): void {

    this._sq(to).occupant = this._sq(from).occupant
    this._sq(from).occupant = null 
  }

  private _castle(r: ActionRecord, mode: ActionMode): void {

    if (mode === 'undo') {
      if (r.move.to.file === 'g') {
        this._move({...r.move.from, file: 'g'}, r.move.from, true)  
        this._move({...r.move.from, file: 'f'}, {...r.move.from, file: 'h'}, true) 
      }
      else {
        this._move({...r.move.from, file: 'c'}, r.move.from, true)  
        this._move({...r.move.from, file: 'd'}, {...r.move.from, file: 'a'}, true) 
      }
    }
    else {
      if (r.move.to.file === 'g') {
        this._move(r.move.from, {...r.move.from, file: 'g'}, true)  
        this._move({...r.move.from, file: 'h'}, {...r.move.from, file: 'f'}, true) 
      }
      else {
        this._move(r.move.from, {...r.move.from, file: 'c'}, true)  
        this._move({...r.move.from, file: 'a'}, {...r.move.from, file: 'd'}, true) 
      }
    }
  }

  private _track(r: ActionRecord, mode: ActionMode): void {

    const side = r.move.piece.side
      // fall through, for rooks
    if (r.action === 'castle') {
      this._tracking[side].trackCastle(r.move, mode)
    }
    else {
      if (r.action.includes('romote')) {
        this._tracking[side].trackPromotion(r.move.to, mode)
      } 
      if (r.action.includes('capture')) {
        this._tracking[r.captured!.side].trackCapture(r.captured!, r.move.to, mode)
      }
      if (r.action === 'move' || r.action.includes('capture')) {
        this._tracking[side].trackPositionChange(r.move, mode)
      }
    }
  }

  private _getSurroundingSquares(pos: Position) /* it returns what it returns ;) */ {

    return {
      N: hasN(pos) ? this._squares[getNRank(pos)][pos.file] : undefined,
      NE: (hasN(pos) && hasE(pos)) ? this._squares[getNRank(pos)][getEFile(pos)] : undefined,
      E: (hasE(pos)) ? this._squares[pos.rank][getEFile(pos)] : undefined,
      SE: (hasS(pos) && hasE(pos)) ? this._squares[getSRank(pos)][getEFile(pos)] : undefined,
      S: (hasS(pos)) ? this._squares[getSRank(pos)][pos.file] : undefined,
      SW: (hasS(pos) && hasW(pos)) ? this._squares[getSRank(pos)][getWFile(pos)] : undefined,
      W: (hasW(pos)) ? this._squares[pos.rank][getWFile(pos)] : undefined,
      NW: (hasN(pos) && hasW(pos)) ? this._squares[getNRank(pos)][getWFile(pos)] : undefined,

        // Neighbor is open (so vulnerable from certain types from afar),
        // or contains an opponent capable of capturing from this neighboring square
      vulnerableOnDiagonalFromPrimaries(sideToCapture: Side): boolean {
        return !!(this.NE && (!this.NE!.occupant || isOpponent(this.NE!.occupant, sideToCapture, ['bishop', 'queen']))) 
        || 
        !!(this.SE && (!this.SE!.occupant || isOpponent(this.SE!.occupant, sideToCapture, ['bishop', 'queen']))) 
        || 
        !!(this.SW && (!this.SW!.occupant || isOpponent(this.SW!.occupant, sideToCapture, ['bishop', 'queen']))) 
        || 
        !!(this.NW && (!this.NW!.occupant || isOpponent(this.NW!.occupant, sideToCapture, ['bishop', 'queen']))) 
      },

        // Neighbor is open (so vulnerable from certain types from afar),
        // or contains an opponent capable of capturing from this neighboring square
      vulnerableOnRankOrFileFromPrimaries(sideToCapture: Side): boolean {
        return !!(this.N && (!this.N!.occupant || isOpponent(this.N!.occupant, sideToCapture, ['rook', 'queen']))) 
          || 
          !!(this.S && (!this.S!.occupant || isOpponent(this.S!.occupant, sideToCapture, ['rook', 'queen']))) 
          || 
          !!(this.E && (!this.E!.occupant || isOpponent(this.E!.occupant, sideToCapture, ['rook', 'queen']))) 
          || 
          !!(this.W && (!this.W!.occupant || isOpponent(this.W!.occupant, sideToCapture, ['rook', 'queen']))) 
      },

        // All other opposing piece will be explicitly checked from their cached positions.
      getOpposingPawnsOrKing(sideToCapture: Side): Position[] {

        const possibleSquaresForOppositePawns = (sideToCapture === 'white') ? [this.NE, this.NW] : [this.SE, this.SW] 
        const actualSquaresWithOppositePawns = possibleSquaresForOppositePawns.filter(
          (sqToTest) => (sqToTest && isOpponent(sqToTest.occupant, sideToCapture, 'pawn'))
        ) as Square[]

        const possibleSquaresForOppositeKing = [this.N, this.NE, this.NW, this.S, this.SE, this.SW]
        const actualSquareWithOppositeKing = possibleSquaresForOppositeKing.find(
          (sqToTest) => (sqToTest && isOpponent(sqToTest.occupant, sideToCapture, 'king'))
        )

        return actualSquareWithOppositeKing ? [...actualSquaresWithOppositePawns, actualSquareWithOppositeKing] : actualSquaresWithOppositePawns
      }
    }
  }

  private _positionCanBeCapturedFrom(
    pos: Position, 
    asSide: Side,
    returnType: 'boolean' | 'positions' // boolean is faster
  ): Position[] | boolean {

    const primaryPieceDangers: Position[] = []
    const surrounding = this._getSurroundingSquares(pos)
    
    const typesToCheck: PrimaryPieceType[] = ['knight']
    if (surrounding.vulnerableOnDiagonalFromPrimaries(asSide)) {
      typesToCheck.push('queen')
      typesToCheck.push('bishop')
    }
    if (surrounding.vulnerableOnRankOrFileFromPrimaries(asSide)) {
      typesToCheck.push('rook')
      if (!typesToCheck.includes('queen')) {
        typesToCheck.push('queen')
      }
    }

    for (let pieceType of typesToCheck) {
      const positionsWithOpponentOfThisType = this._tracking[otherSide(asSide)].getPrimaryTypePositions(pieceType) 
      for (let posToCaptureFrom of positionsWithOpponentOfThisType) {
        if (this._isCapture(this, {
          piece: {type: pieceType, side: asSide}, 
          from: posToCaptureFrom, 
          to: pos
        })) {
          if (returnType === 'boolean') {
            return true
          }
          else {
            primaryPieceDangers.push(posToCaptureFrom)
          }
        }  
      }
    }

    const nearDangers = surrounding.getOpposingPawnsOrKing(asSide)
    if (returnType === 'boolean') {
      return (nearDangers.length > 0)
    }
    return [...primaryPieceDangers, ...nearDangers]
  }


  _dumpTracking(): void {
    console.log("TRACKING " + '\n' +  JSON.stringify(this._tracking, null, 2))
  }
  _syncTrackingTest(): void {
    const target = new Tracking()
    target.syncTo(this._tracking)
    console.log(target)
  }
  _dumpSquares(): void {
    console.log(JSON.stringify(this._squares, null, 2))
  }
}

const createBoard = (f: IsCaptureFn, isObservable?: boolean): BoardInternal => (
  new BoardImpl(f, isObservable)
)

export { 
  type Board as default, 
  type BoardInternal, 
  type BoardSnapshot, 
  createBoard 
}  
