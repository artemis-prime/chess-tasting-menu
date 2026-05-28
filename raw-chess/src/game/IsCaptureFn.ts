import type Move from '../Move'
import type Board from './Board' 

interface IsCaptureFn {
  (board: Board, move: Move): boolean
}

export { type IsCaptureFn as default }