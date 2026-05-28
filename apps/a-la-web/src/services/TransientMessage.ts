import { 
  reaction, 
  makeObservable, 
  observable,
  action,
  computed, 
  type IReactionDisposer
} from 'mobx'

import { 
  type Action,
  ActionRecord,
  type Move,
  type Check,  
  type Side, 
  type GameStatus,
  type ChessListener,
  type Game,
} from '@artemis-prime/chess-core'

import type { ActionMode } from '@artemis-prime/chess-core/src/ActionRecord'

interface Message {
  content: string,
  type: string, 
}

interface MessageInternal extends Message {
  actionIndex: number
}

interface TransientMessage {

  get message(): Message | null
}

class TransientMessageImpl implements ChessListener, TransientMessage {

  private _game: Game
  private _reactionDisposer: IReactionDisposer | null = null
  private _message: MessageInternal | null = null

  constructor(game: Game) {
    this._game = game
    makeObservable(this, {
      message: computed  
    })
    
      // https://mobx.js.org/observable-state.html#limitations
    makeObservable<TransientMessageImpl, '_setMessage' | '_message'>(this, {
      _message: observable.shallow,
      _setMessage: action,
    })
    
  }

  initialize() {
    this._reactionDisposer = reaction(
      () => {
        return (this._game.actionIndex >= 0 && this._message?.actionIndex != this._game.actionIndex)
      },
      (clear: boolean) => {
        if (clear) {
          this._setMessage(null)
        }
      }
    )
  }

  get message(): Message | null {
    return this._message
  }

  dispose() {
    if (this._reactionDisposer) this._reactionDisposer();
  }

  _setMessage(m: MessageInternal | null) {
    this._message = m
  }

  messageSent(m: string, type?: string): void {
    this._setMessage({
      content: m, 
      type: (type ?? ''),
      actionIndex: this._game.actionIndex
    })
  } 

  gameStatusChanged(s: GameStatus): void {}
  inCheck({side, from}: Check): void {}
  notInCheck(side: Side): void {}
  actionResolved(m: Move, action: Action | null): void { }
  actionTaken(r: ActionRecord, mode: ActionMode): void {}
  actionsRestored(recs: readonly ActionRecord[]): void {}
}

export {
  type TransientMessage as default,
  type Message,
  TransientMessageImpl
}
