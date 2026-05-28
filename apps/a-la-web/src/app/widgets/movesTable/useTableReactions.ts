import { useEffect } from 'react'
import { reaction, type IReactionDisposer } from 'mobx'

import type { Game, Side } from '@artemis-prime/chess-core'

import Rows from './Rows'
import getMoveNote from './getMoveNote'

const useTableReactions = (game: Game, r: Rows) => {

  useEffect(() => {
    const disposers: IReactionDisposer[] = []
    disposers.push(reaction(
      () => {
          // Reaction firing as the result of an action after an undo
          // So must rewind lastActionIndex to exactly the second to last
          // element (since that is the last index handled that is still valid) 
        if (r.lastActionIndex >= 0 && game.actions.length - 1 <= r.lastActionIndex) {
          r.lastActionIndex = game.actions.length - 2
        }
        
        return ({
          first: r.lastActionIndex, 
          last: game.actions.length - 1
        })
      },
      ({first, last}) => {
        const lastRow = first % 2 ? (first - 1) / 2 : first / 2
          // If there have been undo's...
        const currentRows = (lastRow < r.rows.length - 1) ? 
            // ...truncate the array 
          r.rows.slice(0, lastRow + 1) 
          : 
          [...r.rows]

        let index = first + 1
        for ( ; index <= last; index++) {
          const currentAction = game.actions[index] 
          const previousAction = game.actions[index - 1] 
            // black
          if (index % 2) {
            const row = r.rows[r.rows.length - 1]
              // Must mutate the actual array
            currentRows[currentRows.length - 1] = {
              white: {...row.white},
              black: {
                str: currentAction.toCommonLANString(), 
                rec: currentAction,
                note: getMoveNote(currentAction, previousAction)
              },
            }
          } 
            // white
          else {
            currentRows.push({
              white: {
                str: currentAction.toCommonLANString(),
                rec: currentAction,
                note: getMoveNote(currentAction, previousAction)
              },
              black: null,
            }) 
          }
        }
        r.lastActionIndex = --index
        r.setRows(currentRows)
    }))

    disposers.push(reaction(
      () => {
        let hilightedRow: number | null = null // not in undo / redo "state" 
        let hilightedSide: Side = 'white'  // arbitrary (avoiding null)
          // in undo / redo "state"
        if (game.actionIndex < game.actions.length - 1) {
            // boundary condition
          if (game.actionIndex === -1) {
            hilightedRow = -1
          }
          else {
            hilightedRow = (game.actionIndex % 2) ? ((game.actionIndex - 1) / 2) : (game.actionIndex / 2)
            hilightedSide = (game.actionIndex % 2) ? 'black' : 'white' 
          }
        }
        return {
          hilightedRow,
          hilightedSide
        }
      },
      ({hilightedRow, hilightedSide}) => {
        r.setHilightedMoveRow(hilightedRow)
        r.setHilightedSide(hilightedSide) 
      }
    ))

    return () => {disposers.forEach((disposer) => { disposer() })}
  }, [])
}

export default useTableReactions
