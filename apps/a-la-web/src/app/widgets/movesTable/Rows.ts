import type { ReactNode } from 'react'
import { 
  makeObservable, 
  observable, 
  action, 
} from 'mobx'

import { ActionRecord, type Side} from '@artemis-prime/chess-core'

interface MoveRow {
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

class Rows {

  rows: MoveRow[] = []
  lastActionIndex =  -1

  hilightedMoveRow: number | null = null
  hilightedSide: Side = 'white' // arbitrary.  only dereferenced after being set  

  constructor() {
    makeObservable(this, {
      rows: observable.shallow,
      hilightedMoveRow: observable,
      hilightedSide: observable,
      setRows: action,
      setHilightedMoveRow: action,
      setHilightedSide: action,
    })
  }

  setRows(rows: MoveRow[]) {this.rows = rows}
  setHilightedMoveRow(r: number | null) {this.hilightedMoveRow = r}
  setHilightedSide(s: Side) {this.hilightedSide = s}
}

export {
  Rows as default,
  type MoveRow,
}