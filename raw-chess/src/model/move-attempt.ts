import type MoveType from './move-type'
import type Move from './move'

  // The evaluation of a *single attempted* move (e.g. the move currently
  // under the cursor during a drag): the move paired with the kind it
  // resolves to, or null when the move is invalid. Drives square
  // highlighting. Contrast with LegalMove, whose type is never null.
interface MoveAttempt {
  readonly move: Move
  readonly type: MoveType | null
}

export { type MoveAttempt as default }
