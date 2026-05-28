import React, { type PropsWithChildren } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react-lite'
import type {  VariantProps } from 'stitches-native'

import { 
  type SquareState, 
  type ObsSquare,
  type ObsSquareStateRef,
  FILES 
} from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/style'
import { usePulses } from '~/services'

import PieceComponent from './Piece'

const SquareInner = styled(View, {
  aspectRatio: 1,
  width: '12.5%',
  height: '12.5%',
  variants: {
    brown: {
      true: {
        backgroundColor: '$chessboardBrown'
      },
    },
  }
})

const StyledFeedbackView = styled(View, {

  position: 'absolute', 
  top: 0, 
  bottom: 0, 
  left: 0, 
  right: 0,
  justifyContent: 'center', 
  alignItems: 'center', 

  variants: {
    effect: {
      origin: {
        opacity: 0.75
      },
      move: {
        borderColor: 'green',
        borderWidth: '$normal',
        borderRadius: '$rounded',
      },
      promote: {
        borderColor: 'yellow',
        borderWidth: '$normal',
      },
      castleRookTo: {
        borderColor: 'darkgreen',
        borderWidth: '$normal',
      },
      castleRookFrom: {
        borderColor: 'darkgreen',
        borderWidth: '$normal'
      },
    }
  }
})
type EffectsViewVariants = VariantProps<typeof StyledFeedbackView>
  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectVariant = EffectsViewVariants['effect'] // includes undefined


const FeedbackView: React.FC<{
  squareStateRef: ObsSquareStateRef,
} & PropsWithChildren> = observer(({
  squareStateRef,
  children
}) => {

  const pulses = usePulses()

  const getEffectFromPositionState = (s: SquareState): EffectVariant  => {

    let effect: EffectVariant = undefined
    if (s === 'move' || s === 'castle') {
      effect = 'move'
    }
    else if (s.includes('romote') && pulses.fast) {
      effect = 'promote'
    }
    else if (s === 'castleRookFrom' && pulses.slow) {
      effect = 'castleRookFrom'
    }
      // // alternate with castleRookFrom
    else if (s === 'castleRookTo' && !pulses.slow) {
      effect = 'castleRookTo'
    }
    return effect
  }

  return (
    <StyledFeedbackView effect={getEffectFromPositionState(squareStateRef.squareState)} >
      {children}
    </StyledFeedbackView>
  )
})

  // See comments in Chessboard.tsx re sizing changes 
const Square: React.FC<{  
  square: ObsSquare,
  sizeInLayout: number | undefined
  css?: CSS
}> = observer(({
  square,
  sizeInLayout,
  css 
}) => {

  const rankOdd = (square.rank % 2)
  const fileOdd = (FILES.indexOf(square.file) % 2)
  const brown = (rankOdd && fileOdd) || (!rankOdd && !fileOdd) ? {brown: true} : {}

    // Only do inner layout stuff if we have an accurate size available.
    // This avoids potentional jump after initial layout.
  return (
    <SquareInner {...brown} css={css}>
    {sizeInLayout && (
      <FeedbackView squareStateRef={square} >
         <PieceComponent square={square} size={sizeInLayout} /> 
      </FeedbackView>
    )}
    </SquareInner>
  )
})

export default Square
