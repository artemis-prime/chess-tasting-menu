import type { ReactNode } from 'react'
import { 
  makeObservable, 
  observable, 
  action,
  type IReactionDisposer,
  reaction, 
} from 'mobx'

import { ActionRecord, type Game, type Side} from '@artemis-prime/chess-core'
import type { GetMoveNoteFn } from '~/app/widgets/movesTable/getMoveNote'

interface MovePair {
  white: {
    str: string
    rec: ActionRecord 
    note: ReactNode
  }
  black: {
    str: string
    rec: ActionRecord 
    note: ReactNode
  } | null
} 

class MovePairs {

  private _game: Game
  private _moveNoteFn: GetMoveNoteFn | null = null
  private _lastActionIndex =  -1

  rows: MovePair[] = []

  hilightedMoveRow: number | null = null
  hilightedSide: Side = 'white' // arbitrary.  only dereferenced after being set  

  private _disposers: IReactionDisposer[] = []

  constructor(g: Game) {
    this._game = g
    makeObservable(this, {
      rows: observable.shallow,
      hilightedMoveRow: observable,
      hilightedSide: observable,
      setRows: action,
    })
  }

  setRows(rows: MovePair[]) {this.rows = rows}
  setMoveNoteFn(f: GetMoveNoteFn) { this._moveNoteFn = f }

  initialize() {

      // Listens to the action stack and reacts by updating
      // the MovePairs stack appropriately.
    this._disposers.push(reaction(
      () => {
          // Reaction firing as the result of an action *after* an undo,
          // so must trim back _lastActionIndex to exactly the second to last
          // element (since that is the last index handled that is still valid) 
        if (this._lastActionIndex >= 0 && this._game.actions.length - 1 <= this._lastActionIndex) {
          this._lastActionIndex = this._game.actions.length - 2
        }
        
        return ({
          first: this._lastActionIndex, 
          last: this._game.actions.length - 1
        })
      },
      ({first, last}) => {
        const lastRow = first % 2 ? (first - 1) / 2 : first / 2
          // If there have been undo's...
        const currentRows = (lastRow < this.rows.length - 1) ? 
            // ...truncate the array 
          this.rows.slice(0, lastRow + 1) 
          : 
          [...this.rows]

        let index = first + 1
        for ( ; index <= last; index++) {
          const currentAction = this._game.actions[index] 
          const previousAction = this._game.actions[index - 1] 
            // black
          if (index % 2) {
            const row = this.rows[this.rows.length - 1]
              // Must mutate the actual array
            currentRows[currentRows.length - 1] = {
              white: {...row.white},
              black: {
                str: currentAction.toCommonLANString(), 
                rec: currentAction,
                note: this._moveNoteFn ? this._moveNoteFn(currentAction, previousAction) : null
              },
            }
          } 
            // white
          else {
            currentRows.push({
              white: {
                str: currentAction.toCommonLANString(),
                rec: currentAction,
                note: this._moveNoteFn ? this._moveNoteFn(currentAction, previousAction) : null
              },
              black: null,
            }) 
          }
        }
        this._lastActionIndex = --index
        this.setRows(currentRows)
    }))

      // Listens to being 'in the undo / redo mode' and
      // reacts by setting hilightedRow and hilightedSide as needed.
    this._disposers.push(reaction(
      () => {
        let hilightedRow: number | null = null // not in undo / redo "state" 
        let hilightedSide: Side = 'white'  // arbitrary (avoiding null)
          // in undo / redo "state"
        if (this._game.actionIndex < this._game.actions.length - 1) {
            // boundary condition
          if (this._game.actionIndex === -1) {
            hilightedRow = -1
          }
          else {
            hilightedRow = (this._game.actionIndex % 2) ? ((this._game.actionIndex - 1) / 2) : (this._game.actionIndex / 2)
            hilightedSide = (this._game.actionIndex % 2) ? 'black' : 'white' 
          }
        }
        return {
          hilightedRow,
          hilightedSide
        }
      },
      action(({hilightedRow, hilightedSide}) => {
        this.hilightedMoveRow = hilightedRow
        this.hilightedSide = hilightedSide 
      })
    ))
  }

  dispose() {
    this._disposers.forEach((disposer) => { disposer() })
  }
}

export {
  MovePairs as default,
  type MovePair,
}
