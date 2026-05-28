import React from 'react'
import { observer } from 'mobx-react-lite'
import { useDroppable } from '@dnd-kit/core'
import type { VariantProps } from '@stitches/react'

import { 
  FILES,
  type ObsSquare, 
  type SquareState,
  positionToString, 
} from '@artemis-prime/chess-core'

import { styled } from '~/style'
import { usePulses } from '~/services'

import PieceComponent from './Piece'

const SquareOuter = styled('div', {

    //border: 0.5px blue solid;
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  variants: {
    dark: {
      true: {
        backgroundColor: '$chessboardBrown' 
      }
    }
  }
})

const EffectsView = styled('div', {
  position: 'absolute', 
  top: 0, 
  bottom: 0, 
  left: 0, 
  right: 0,
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center', 
  variants: {
    effect: {
      move: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promote: {
        border: '1px yellow solid'
      },
      castle: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promoteCapture: {
        border: '1px yellow solid'
      },
      castleRookFrom: {
        border: '1px darkgreen solid' 
      },
      castleRookTo: {
        border: '1px darkgreen solid' 
      },
      castleRookFromPulse: {
        border: '3px darkgreen solid' 
      },
      castleRookToPulse: {
        border: '3px darkgreen solid' 
      },
    }
  }
})

  // https://simondosda.github.io/posts/2021-06-17-interface-property-type.html
type EffectsViewVariants = VariantProps<typeof EffectsView>
type EffectVariant = EffectsViewVariants['effect'] // includes undefined

const SquareComponent: React.FC<{
  square: ObsSquare 
}> = observer(({
  square
}) => {

  const pulses = usePulses()

  const getEffectFromState = (state: SquareState): EffectVariant  => {
    if (state === 'castleRookFrom') {
      return pulses.slow ? state : 'castleRookFromPulse' 
    }
    else if (state === 'castleRookTo') {
      return !pulses.slow ? state : 'castleRookToPulse' 
    }
    else if (state.includes('romote')) {
      if (pulses.fast) {
        return undefined
      }
    }
    else if ([
      'origin',
      'invalid',
      'none',
      'kingInCheck',
      'inCheckFrom',
      'capture'
    ].includes(state as string)) {
      return undefined
    }
    return state as EffectVariant 
  }

  return (
    <EffectsView effect={getEffectFromState(square.squareState)} >
      <PieceComponent square={square} />  
    </EffectsView>
  )
})

const SquareDndWrapper: React.FC<{
  square: ObsSquare 
}> = ({ 
  square
}) => {

  const {setNodeRef: ref} = useDroppable({
    id: positionToString(square), 
    data: { position: square },
  })

  const rankOdd = square.rank % 2
  const fileOdd = !(FILES.indexOf(square.file) % 2)
  const dark = (rankOdd && fileOdd) || (!rankOdd && !fileOdd)

    // https://github.com/clauderic/dnd-kit/issues/389#issuecomment-1013324147
  return (
    <SquareOuter ref={ref} dark={dark} >
      <SquareComponent square={square} />
    </SquareOuter>  
  )
}

export default SquareDndWrapper
