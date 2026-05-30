  // Barrel for the board aggregate, so consumers can
  // `import { createBoard } from '../board'` while the
  // implementation lives in an explicitly-named file.
export { createBoard } from './board'
export type { default, BoardInternal, BoardSnapshot } from './board'
