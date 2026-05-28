import React from 'react'
import { observer } from 'mobx-react-lite'

import { styled } from '~/style'
import { Flex } from '~/primatives'

import registry from './pieceRegistry'
import { useDraggingPiece } from './ChessDnD'
import type { SpecificPieceProps } from './Piece'

const PieceEffectsView = styled(Flex, {
  '& svg': {
    display: 'block'
  },

  variants: {
    side: {
      white: {
        '& svg': {
          fill: '$pieceColorWhite',
        },
      },
      black: {
        '& svg': {
          fill: '$pieceColorBlack',
        },
      },
    },
  }
})

const DraggingPiece: React.FC<{
  size: number
}> = observer(({
  size
}) => {

  const pieceRef = useDraggingPiece()

  if (pieceRef.piece) {
    const SpecificPiece = registry.get(pieceRef.piece.type) as React.ComponentType<SpecificPieceProps>
    const pieceSize = pieceRef.piece.type === 'pawn' ? size * .85 : size
    return (
      <PieceEffectsView 
        justify='center'
        direction='row'
        align='center'
        side={pieceRef.piece.side}
      >
        <SpecificPiece size={pieceSize} />
      </PieceEffectsView>
    )
  }
  return null
})

export default DraggingPiece
