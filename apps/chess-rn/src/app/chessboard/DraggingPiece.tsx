import React  from 'react'
import { Text } from 'react-native'
import { observer } from 'mobx-react-lite'

import { styled } from '~/style'

import { PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'
import { useDragState } from './ChessDnD'

const PieceText = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  position: 'absolute',
  opacity: 0.8,
  variants: {
    side: {
      white: { color: '$pieceColorWhite' },
      black: { color: '$pieceColorBlack' }
    }
  }
})

const DraggingPiece: React.FC<{ sizeInLayout: number | undefined }> = observer(({
  sizeInLayout,
}) =>  {
  
  const ds = useDragState()

  return (sizeInLayout && ds.piece && ds.offset) ? (
    <PieceText 
      side={ds.piece.side} 
      css={{
        l: ds.offset.x - sizeInLayout / 2, 
        t: ds.offset.y - sizeInLayout / 2,
        fontSize: sizeInLayout * .8,
        w: sizeInLayout,
        h: sizeInLayout
      }}
    >{PIECETYPE_TO_UNICODE[ds.piece.type]}</PieceText>
  ) : null
})

export default DraggingPiece
