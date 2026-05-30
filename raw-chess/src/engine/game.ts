import {
  action,
  computed,
  makeObservable, 
  observable, 
  autorun,
  when,
  type IReactionDisposer
} from 'mobx'

import type MoveType from '../model/move-type'
import MoveRecord from '../model/move-record'
import type { default as Board, BoardInternal, BoardSnapshot } from './board'
import { createBoard } from './board'
import type Check from '../model/check'
import type ChessListener from '../model/chess-listener'
import type GameStatus from '../model/game-status'
import { 
  STATUS_IN_PLAY, 
  STATUS_CAN_UNDO, 
  gameEndingToString,
  gameEndingFromString,
} from '../model/game-status'
import type Move from '../model/move'
import { movesEqual } from '../model/move'
import type Piece from '../model/piece'
import { 
  type PieceType, 
  type PrimaryPieceType, 
  type Side, 
  SIDE_FROM_CODE,
  otherSide,
  type SideCode,
  PRIMARY_PIECETYPES
} from '../model/piece'

import type Position from '../model/position'
import { positionToString } from '../model/position'
import type MoveAttempt from '../model/move-attempt'
import type LegalMove from '../model/legal-move'
import type ObsSquare from '../model/observable/obs-square'

import { getMoveAttemptStateForPosition, getCheckStateForPosition } from './status-util'
import type { default as MoveRule } from './move-rule'
import Notifier from './notifier'
import registry from './rules-registry'
import type Snapshotable from './snapshotable'
import type Square from './square'

const DEFAULT_GAME_STATUS: GameStatus = {
  state: 'new',
  victor: undefined
}

  // These would be persisted to and read from a file
  // by implementing apps. (see chess-web)
interface GameSnapshot {

  artemisPrimeChessGame: any
  board: BoardSnapshot
  actions?: string[]
  currentTurn: SideCode
  gameEnding?: string
}

interface Game extends Snapshotable<GameSnapshot> {

    // Determine which valid action is intended by / possible with
    // the move attempted. (This could be used during drag'n'drop 
    // canDropOnMe() type functions.)
    // 
    // MoveAttempt resulting from tryMove() for the
    // same move *will be cached* internally until:
    //  1) finalizeMove() is called 
    //  2) abandonMove() is called 
    // Note that this is a form of debouncing
  tryMove(m: Move): MoveType | null
  finalizeMove(): boolean // action was taken
  abandonMove(): void
  
  get canUndo(): boolean
  get canRedo(): boolean
  undo(): void
  redo(): void

  reset(): void
  offerADraw(): void
  concede(): void 

  takeSnapshot() : GameSnapshot
  restoreFromSnapshot(g: GameSnapshot) : void

  getOccupant(p: Position): Piece | null

  get gameStatus(): GameStatus  // observable
  get playing(): boolean        // observable
  get currentTurn(): Side       // observable
  get check(): Check | null     // observable
  get actions(): MoveRecord[] // observable
  get actionIndex(): number     // observable

    // id should be the same across multiple registrations for the 
    // same listener.
  registerListener(l: ChessListener, uniqueId: string): void
  unregisterListener(uniqueId: string): void

  getBoardAsArray(reverse: boolean): ObsSquare[]
}

class GameImpl implements Game {

  public static currentInstance: GameImpl 

  private _board: BoardInternal
  private _scratchBoard: BoardInternal

  private _currentTurn: Side = 'white' 
    // Need to initialize for babel : https://github.com/mobxjs/mobx/issues/2486
  private _gameStatus: GameStatus = DEFAULT_GAME_STATUS
  private _rules: Map<PieceType, MoveRule>  = registry 
  private _actions = [] as MoveRecord[] 
    // For managing undo / redo.  
    // The index within _actions of the MoveType that reflects
    // the current state. Note that -1 is *correctly* 
    // the original state of the board. 
    // So _action[0] is conveniently the first move, and that stateIndex
    // reflects the state after that MoveType has been applied. 
    // (This fascilitates impl of undo / redo)
  private _stateIndex = -1 
  private _attempt: MoveAttempt | null = null 

  private _notifier: Notifier = new Notifier() 

  constructor() {

    this._board = createBoard(this._isCapture.bind(this), true)
    this._scratchBoard = createBoard(this._isCapture.bind(this))
  
    makeObservable(this, {
      finalizeMove: action,
      undo: action.bound,
      redo: action.bound,
      reset: action.bound, // action.bound makes it easy to call from button's onChange
      offerADraw: action.bound,
      concede: action.bound,
      restoreFromSnapshot: action,
      canUndo: computed,
      canRedo: computed,
      gameStatus: computed,
      currentTurn: computed,
      check: computed,
      playing: computed,
      actions: computed,
      actionIndex: computed
    })

      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<GameImpl, 
      '_currentTurn'| 
      '_toggleTurn' | 
      '_stateIndex' |
      '_actions' |
      '_reflectMoveAttempt' | 
      '_checkStalemate' |
      '_gameStatus'
    >(this, {
      _currentTurn: observable,
      _gameStatus: observable.shallow,
      _toggleTurn: action,
      _stateIndex: observable,
      _actions: observable.shallow,
      _reflectMoveAttempt: action,
      _checkStalemate: action
    })
  }

  registerReactions(): IReactionDisposer[] {
    const cleanupAutorun = autorun(() => {
      this._notifier.gameStatusChanged(this.gameStatus)  
    })
    return [cleanupAutorun]
  } 


  get gameStatus(): GameStatus {
    return this._gameStatus
  }

  get actions(): MoveRecord[] {
    return [...this._actions]
  }

  get actionIndex(): number {
    return this._stateIndex
  }

  get playing(): boolean {
    return STATUS_IN_PLAY.includes(this._gameStatus.state) 
  }

  private get statusAllowsUndoRedo(): boolean {
    return STATUS_CAN_UNDO.includes(this._gameStatus.state) 
  }

  getOccupant(p: Position): Piece | null {
    return this._board.getOccupant(p)
  }

  getBoardAsArray = (whiteOnBottom: boolean): ObsSquare[] => (
    (whiteOnBottom) ? this._board.asSquareDescs  : [...this._board.asSquareDescs].reverse()
  )

  offerADraw(): void {
    this._gameStatus = { state: 'draw', victor: 'none' }
  }

  concede(): void {
    this._gameStatus = { state: 'conceded', victor: otherSide(this._currentTurn) }
  }

  reset() {
    this._board.reset()
    this._scratchBoard.reset()
    this._currentTurn = 'white'
    this._actions.length = 0
    this._stateIndex = -1 
    this._gameStatus = { state: 'new', victor: undefined }
  }

  async restoreFromSnapshot(g: GameSnapshot): Promise<void> {

    if (!g.artemisPrimeChessGame) throw new Error('restoreFromSnapshot() invalid Game Object!')

    this._board.restoreFromSnapshot(g.board) 
    this._currentTurn = SIDE_FROM_CODE[g.currentTurn]
    if (g.actions) {
      this._actions = g.actions.map((lan: string) => (MoveRecord.fromRichLANString(lan)))
    }
    else {
      this._actions = []  
    }
    this._stateIndex = this._actions.length - 1

    if (g.gameEnding) {
      this._gameStatus = gameEndingFromString(g.gameEnding)
    }
    else {
      this._gameStatus = { state: 'restored', victor: undefined }
    }
    const stateToWaitFor = this._gameStatus.state
    this._applyInCheck()
    this._notifyCheck(null) // was tracked in restoreFromSnapshot() above

      // The movesRestored() notification should received *after* 
      // the gameStatusChanged() notification.
      // If we just await the state change via when(), 
      // we effectively create a new listerner,  which by order of creation
      // will run *after* the listener created by autorun() in GameImpl's constructor.
    await when(() => this._gameStatus.state === stateToWaitFor);
    this._notifier.movesRestored([...this._actions])
  }

  takeSnapshot(): GameSnapshot {
    const actionsToCurrentState = [...this._actions]
    actionsToCurrentState.length = this._stateIndex + 1 // truncate to current state 

    return {
      artemisPrimeChessGame: true,
      board: this._board.takeSnapshot(),
      actions: actionsToCurrentState.map((rec: MoveRecord) => (rec.toRichLANString())),
      currentTurn: this._currentTurn.charAt(0) as SideCode,
      gameEnding: gameEndingToString(this._gameStatus)
    }
  }  

  get check(): Check | null {
    return this._board.check
  }

  get currentTurn(): Side {
    return this._currentTurn
  }

  registerListener(l: ChessListener, uniqueId: string): void {
    this._notifier.registerListener(l, uniqueId)
  }

  unregisterListener(uniqueId: string): void {
    this._notifier.unregisterListener(uniqueId)
  }

    // Do not call directly.  Passed to Board instance to 
    // implement checkChecking
  private _isCapture(board: Board, m: Move): boolean {
    let result: MoveType | null = null
    const rule = this._rules.get(m.piece.type)

    if (rule) {
      result = rule.legalAs(board, m)
    } 
    return !!result?.includes('capture')
  }

  tryMove(move: Move): MoveType | null {

    if (!this.playing) return null

    if (!this._attempt || !movesEqual(this._attempt!.move, move)) {
      if (!move.piece) {
        this._notifier.messageSent(`There's no piece at ${positionToString}!`, 'transient-warning') 
      }
      const rule = this._rules.get(move.piece?.type)
      let action: MoveType | null = null
      if (rule) {
        action = rule.legalAs(
          this._board, 
          move, 
          (m: string): void => { this._notifier.messageSent(m, 'transient-warning') }
        )
        if (action) {
          this._scratchBoard.syncTo(this._board)
          const r = new MoveRecord(move, action, this._getCaptured(move, action))
          const wasInCheck = this._scratchBoard.check?.side === r.move.piece.side
          this._scratchBoard.applyAction(r, 'do')
          const isInCheck = this._scratchBoard.check?.side === r.move.piece.side
          if (isInCheck) {
            this._notifier.messageSent(`${r.toCommonLANString()} isn't possible. It would ` +
              `${wasInCheck ? 'leave you' : 'put you'} in check!`, 'transient-warning')  
            action = null
          }
          else if (wasInCheck) {
            this._notifier.messageSent(`(${r.toCommonLANString()} is ok to get out of check.)`, 'transient-info')  
          }
        } 
        this._notifier.moveTried({ move, type: action })
      } 
      this._reflectMoveAttempt({ move, type: action })
    }
    return this._attempt!.type
  }

  abandonMove(): void {
    this._reflectMoveAttempt(null)
  }

  finalizeMove(): boolean {

    if (!this.playing) {
      return false
    }
    if (!this._attempt?.type) {
      this.abandonMove()
      return false
    }

    const { move, type: action } = this._attempt
    const r = new MoveRecord(move, action, this._getCaptured(move, action))
    const previousCheck = this._board.check
    this._board.applyAction(r, 'do')
    this._reflectMoveAttempt(null)
    this._notifier.moveApplied(r, 'do')
    this._applyInCheck()
    this._notifyCheck(previousCheck)
    const currentCheck = this._board.check
    const opponent = otherSide(r.move.piece.side)
    if (currentCheck) {
      r.annotatedResult = this._checkForCheckmate(opponent) ? 'checkmate' : 'check'
    }
    else {
      if (this._checkStalemate(opponent)) {
        r.annotatedResult = 'stalemate'
      }
    }
    if (this._stateIndex + 1 < this._actions.length) {
        // If we've undone actions since the most recent 'real' move,
        // truncate the stack since we can no longer meaningfully 
        // 'redo' actions more recent than the one we're currently on.
      this._actions.length = this._stateIndex + 1 
    }
    this._actions.push(r)
    this._stateIndex = this._actions.length - 1
    this._toggleTurn()
    return true
  }

  get canUndo() {
    return this.statusAllowsUndoRedo && this._stateIndex >= 0 
  }

  undo() {
    if (this.canUndo) {
      const { state } = this._gameStatus
      if (state === 'checkmate' || state === 'stalemate') {
        this._gameStatus = { state: 'resumed', victor: undefined }
      }
      const r = this._actions[this._stateIndex]
      const previousCheck = this._board.check
      this._board.applyAction(r, 'undo')
      this._notifier.moveApplied(r, 'undo')
      this._applyInCheck()      
      this._notifyCheck(previousCheck)
      this._stateIndex--
      this._toggleTurn()
    }
  }

  get canRedo() {
    return this.statusAllowsUndoRedo && (this._stateIndex + 1 < this._actions.length)
  }

  redo() {
    if (this.canRedo) {
      this._stateIndex++
      const r = this._actions[this._stateIndex]
      const previousCheck = this._board.check
      this._board.applyAction(r, 'redo')
      this._notifier.moveApplied(r, 'redo')
      this._applyInCheck()
      this._notifyCheck(previousCheck)
      const currentCheck = this._board.check
      if (currentCheck) {
        this._checkForCheckmate(otherSide(r.move.piece.side))
      }
      else {
        this._checkStalemate(otherSide(r.move.piece.side))
      }
      this._toggleTurn()
    }
  }

  private _reflectMoveAttempt(res: MoveAttempt | null) {

    this._attempt = res
    this._board.asSquares.forEach((sq: Square) => {
      sq.setSquareState(getMoveAttemptStateForPosition(sq, res))
    });
  }

    // We shouldn't clash with action / drag states, 
    // since this code is called after 
    // action statuses are cleared.
  private _applyInCheck() {
    const check = this._board.check
    this._board.asSquares.forEach((sq: Square) => {
      sq.setSquareState(getCheckStateForPosition(sq, check)) 
    })
  
  }

  private _getCaptured = (move: Move, action: MoveType, ) : Piece | undefined => (
    (action.includes('capture')) ? {...this._board.getOccupant(move.to)!} : undefined  
  )

  private _legalMovesDontAllResultInCheck(moves: LegalMove[], side: Side): boolean {
    this._scratchBoard.syncTo(this._board)
    return moves.some((rm: LegalMove) => {
      const r = new MoveRecord(rm.move, rm.type, this._getCaptured(rm.move, rm.type))
      this._scratchBoard.applyAction(r, 'do')
      const check = this._scratchBoard.check
      this._scratchBoard.applyAction(r, 'undo')
      return !check
    })
  }

  private _kingCanMove(side: Side): boolean {
    const pos = this._board.kingPosition(side)
    const rule = this._rules.get('king')!
    const moves = rule.legalMoves(this._board, {type: 'king', side}, pos, true)
    return this._legalMovesDontAllResultInCheck(moves, side)
  }

  private _primariesCanMove(side: Side): boolean {
    return PRIMARY_PIECETYPES.some((type: PrimaryPieceType) => {
      const positions = this._board.primaryPositions(side, type)
      const rule = this._rules.get(type)
      return rule && positions.some((pos) => {
        const moves = rule.legalMoves(this._board, {type, side}, pos)
        return this._legalMovesDontAllResultInCheck(moves, side)
      })
    })
  }

  private _pawnsCanMove(side: Side): boolean {
    const pawnPositions = this._board.pawnPositions(side)
    const rule = this._rules.get('pawn')!
    return pawnPositions.some((pos) => {
      const moves = rule.legalMoves(this._board, {type: 'pawn', side}, pos)
      return this._legalMovesDontAllResultInCheck(moves, side)
    })
  }

  private _notifyCheckForSide(side: Side, previousCheck: Check | null): void {

    const wasInCheck = previousCheck?.side === side
    const check = this._board.check
    const inCheck = check?.side === side

      // Only notify if in check state changes 
    if (!wasInCheck && inCheck) {
      this._notifier.inCheck(check)
    }
    else if (wasInCheck && !inCheck){
      this._notifier.notInCheck(side)  
    }
  }

    // We have to check each side after every actions, since 
    // can put an opponent in check w a move,
    // or take oneself out of check
  private _notifyCheck(previousCheck: Check | null): void {
    this._notifyCheckForSide('white', previousCheck)
    this._notifyCheckForSide('black', previousCheck)
  }

  private _checkForCheckmate(side: Side): boolean {
    if (
      this._board.check?.side === side 
      && 
      !this._kingCanMove(side)
      &&
      !this._primariesCanMove(side)
      &&
      !this._pawnsCanMove(side)
    ) {
      this._gameStatus = { state: 'checkmate', victor: otherSide(side) }
      return true 
    }
    return false
  }

  private _checkStalemate(side: Side): boolean {
    if (
      !this._primariesCanMove(side)
      &&
      !this._kingCanMove(side)
      &&
      !this._pawnsCanMove(side)
    ) {
      this._gameStatus = { state: 'stalemate', victor: 'none' }
      return true
    }
    return false
  }

  private _toggleTurn(): void {
    this._currentTurn = (this._currentTurn === 'white') ? 'black' : 'white'
  }
}

const getGameSingleton = () => {
  if (!GameImpl.currentInstance) {
    GameImpl.currentInstance = new GameImpl() 
  }
  return GameImpl.currentInstance
}

export {
  getGameSingleton,
  type Game as default,
  type GameSnapshot  
}
