type Action =
  'move' |
  'capture' |
  'promote' | 
  'castle' | 
  'capturePromote' // if a pawn captures and gets promoted in one move

const ACTIONS = ['move', 'capture', 'promote', 'castle', 'capturePromote'] as readonly Action[] 

export { type Action as default, ACTIONS }
