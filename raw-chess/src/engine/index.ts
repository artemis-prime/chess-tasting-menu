  // Barrel for the game aggregate root, so consumers can
  // `import { getGameSingleton } from '../engine'` while the
  // implementation lives in an explicitly-named file.
export { getGameSingleton } from './game'
export type { default, GameSnapshot } from './game'
