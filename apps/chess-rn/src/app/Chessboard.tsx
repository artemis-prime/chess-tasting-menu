import React, { useEffect, useState } from 'react'
import { View, type LayoutChangeEvent, type ViewStyle } from 'react-native'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { type ObsSquare } from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/style'
import { useChessboardOrientation, useChess, useViewport } from '~/services'
import { BGImage } from '~/primatives'

import Square from './chessboard/Square'
import { ChessDnDShell, useDnDConfig } from './chessboard/ChessDnD'
import DraggingPiece from './chessboard/DraggingPiece'

const ChessboardOuter = styled(View, {
  aspectRatio: '1 / 1',
  width: '100%',
  backgroundColor: 'transparent', 
  borderWidth: '$thicker',
  borderRadius: '$sm',
  overflow: 'hidden', 
  borderColor: '$pieceColorBlack',
  variants: {
    landscape: { true: { width: 'auto' }}
  }
})

const SquaresOuter = styled(View, {
    // This helps with layout issues.  Not sure why precisely. 
  position: 'absolute',
  l: 0,
  t: 0,
  r: 0,
  b: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  backgroundColor: 'transparent', // needed for gestures to work on android
})

const Chessboard: React.FC<{ 
  disableInput: boolean
  css?: CSS
}> = observer(({
  disableInput,
  css 
}) => {

  const game = useChess()
  const bo = useChessboardOrientation()
  const viewport = useViewport()
  
    // Squares need to know their size in pt to do internal layout.
    // Instead of forcing each square listen for it's own size changes,
    // we optimize by doing it here and informing them of changes.
    // We are a simple 8x8 grid after all! :)
  const [boardSize, setBoardSize] = useState<number | undefined>(undefined)
  const { layoutListener: layoutListenerDnd, setWhiteOnBottom: notifyDndOrientationChanged } = useDnDConfig()
      

  useEffect(() => (autorun(() => {
    notifyDndOrientationChanged(bo.whiteOnBottom)
  })),[])

  const layoutListener = (e: LayoutChangeEvent): void  => {
    const {nativeEvent: { layout: {width}}} = e;
    setBoardSize(width)
    layoutListenerDnd(e)
  }

  return (
    <ChessboardOuter 
      css={css} 
      landscape={viewport.landscape}
      pointerEvents={(disableInput ? 'none' : 'auto')} 
      collapsable={false}
    >
      <BGImage imageURI={'wood_grain_bg_low_res'}  style={{height: '100%'}}>
        <SquaresOuter onLayout={layoutListener} >
        {game.getBoardAsArray(bo.whiteOnBottom).map((s: ObsSquare) => (
            // See comments above
          <Square square={s} sizeInLayout={boardSize && boardSize / 8 } key={`key-${s.rank}-${s.file}`} />
        ))}
        </SquaresOuter>
      </BGImage>
      <DraggingPiece sizeInLayout={boardSize && boardSize * .85 / 8} />
    </ChessboardOuter>
  )
})

const BoardWithDnD: React.FC<{ 
  disableInput: boolean
  css?: CSS 
}> = ({
  disableInput,
  css,
}) => (
  <ChessDnDShell>
    <Chessboard disableInput={disableInput} css={css} />
  </ChessDnDShell>
)

export default BoardWithDnD
