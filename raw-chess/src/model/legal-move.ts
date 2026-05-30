import type Move from './move'
import type MoveType from './move-type'

  // A move paired with its kind, produced by enumerating the moves a
  // piece can legally make (MoveRule.legalMoves). The type is never null:
  // illegal destinations are simply absent from the enumeration.
  // Contrast with Resolution, which evaluates a *single attempted* move
  // and whose type is null when that move is invalid.
interface LegalMove {
  readonly move: Move
  readonly type: MoveType
}

export { type LegalMove as default }
