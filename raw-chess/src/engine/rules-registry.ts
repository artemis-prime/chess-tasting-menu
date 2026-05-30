import type { PieceType } from '../model/piece'
import type MoveRule from './move-rule'

import pawn from './rules/pawn'
import queen from './rules/queen' 
import bishop from './rules/bishop'
import rook from './rules/rook' 
import knight from './rules/knight' 
import king from './rules/king' 

export default new Map<PieceType, MoveRule>([
  ['pawn', pawn],
  ['queen', queen],
  ['bishop', bishop],
  ['rook', rook],
  ['knight', knight],
  ['king', king]
])
