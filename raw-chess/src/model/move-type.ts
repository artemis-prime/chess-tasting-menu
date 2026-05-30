type MoveType =
  'simple' |
  'capture' |
  'promote' | 
  'castle' | 
  'capturePromote' // if a pawn captures and gets promoted in one move

const MOVE_TYPES = ['simple', 'capture', 'promote', 'castle', 'capturePromote'] as readonly MoveType[] 

export { type MoveType as default, MOVE_TYPES }
