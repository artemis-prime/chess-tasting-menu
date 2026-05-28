import React from 'react'

import type { PieceType } from '@artemis-prime/chess-core'

import Pawn from './pieces/Pawn' 
import Queen from './pieces/Queen' 
import Bishop from './pieces/Bishop' 
import Rook from './pieces/Rook'
import Knight from './pieces/Knight'
import King from './pieces/King'

import type { SpecificPieceProps } from './Piece'

export default new Map<PieceType, React.ComponentType<SpecificPieceProps>>([
  ['pawn', Pawn],
  ['queen', Queen],
  ['bishop', Bishop],
  ['rook', Rook],
  ['knight', Knight],
  ['king', King]
])
