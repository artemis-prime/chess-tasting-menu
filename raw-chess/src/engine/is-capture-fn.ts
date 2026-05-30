import type Move from '../model/move'
import type Board from './board' 

interface IsCaptureFn {
  (board: Board, move: Move): boolean
}

export { type IsCaptureFn as default }