import type Action from './Action'
import type Move from './Move'

  // Used to represent two notions:
  // 1) a resolved move: Resolved as an Action or null 
  // 2) a resolvable move: Action will *not* be null by definition
interface Resolution {
  readonly move: Move
  readonly action: Action | null
}

export { type Resolution as default }