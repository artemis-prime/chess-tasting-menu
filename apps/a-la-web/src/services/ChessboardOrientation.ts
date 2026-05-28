import type { Game } from '@artemis-prime/chess-core'
import { 
  action, 
  makeObservable, 
  observable, 
  reaction,
  type IReactionDisposer
} from 'mobx'

interface ChessboardOrientation {
  whiteOnBottom: boolean,
  setWhiteOnBottom: (b: boolean) => void
  autoOrientToCurrentTurn: boolean,
  setAutoOrientToCurrentTurn: (b: boolean) => void 
}

class ChessboardOrientationImpl implements ChessboardOrientation {

  private _game: Game
  private _reactionDisposer: IReactionDisposer | null = null
  whiteOnBottom = true
  autoOrientToCurrentTurn = false

  constructor(game: Game) {

    this._game = game
    makeObservable(this,{
      whiteOnBottom: observable,
      autoOrientToCurrentTurn: observable,
      setWhiteOnBottom: action.bound,
      setAutoOrientToCurrentTurn: action.bound,   
    }) 
  }

  initialize() {
    this._reactionDisposer = reaction(
      () => ({
        set: this.autoOrientToCurrentTurn,
        whiteOnBottom: this._game.currentTurn === 'white'
      }), 
      ({set, whiteOnBottom}) => {
        if (set) {
          this.setWhiteOnBottom(whiteOnBottom)
        }
      },
      {scheduler: (run) => (setTimeout(run, 300))}
    )
  }

  dispose() {
    if (this._reactionDisposer) this._reactionDisposer();
  }

  setWhiteOnBottom(b: boolean) {
    this.whiteOnBottom = b
  }

  setAutoOrientToCurrentTurn(b: boolean) {
    this.autoOrientToCurrentTurn = b
  }
}

export { type ChessboardOrientation as default, ChessboardOrientationImpl }
