import React, { type PropsWithChildren } from 'react'
import { 
  Text, 
  View,
  type ColorValue 
} from 'react-native'
import { observer } from 'mobx-react-lite'

import { 
  type ObsSquare,
  type Side,
  PIECETYPE_TO_UNICODE 
} from '@artemis-prime/chess-core'

import { styled, useTheme, type CSS } from '~/style'
import { Box } from '~/primatives'
import { usePulses } from '~/services'

interface ShadowDesc {
  variant: 
    'normal' |
    'large' | 
    'effectRt1' | 
    'effectRt2' | 
    'effectLt1' | 
    'effectLt2'

  color: ColorValue
}

const IN_CHECK_SHADOWS = [
  { variant: 'effectRt1', color: 'rgba(100, 0, 0, 0.5)' },
  { variant: 'effectRt2', color: 'rgba(100, 0, 0, 0.2)' },
  { variant: 'effectLt1', color: 'rgba(100, 0, 0, 0.2)' },
  { variant: 'effectLt2', color: 'rgba(100, 0, 0, 0.1)' }
] as ShadowDesc[]

const CAPTURE_SHADOWS = [
  { variant: 'effectRt1', color: 'rgba(228, 134, 5, 0.4)' },
  { variant: 'effectRt2', color: 'rgba(228, 134, 5, 0.1)' },
  { variant: 'effectLt1', color: 'rgba(228, 134, 5, 0.3)' },
  { variant: 'effectLt2', color: 'rgba(228, 134, 5, 0.1)' }
] as ShadowDesc[]

const NORMAL_SHADOW_COLOR = {
  white: 'rgba(0, 0, 0, 0.3)',
  black: 'rgba(0, 0, 0, 0.5)'
} as {
  [key in Side]: ColorValue
}

interface Offset {
  left: number,
  top: number
}

  // This offset makes the image look centered based on applied styles
const IMAGE_OFFSET = {
  left: -1,
  top: -2
} as Offset

  // This offset makes the image look centered based on applied styles
const IMAGE_OFFSET_LARGER = {
  left: -1,
  top: -6
} as Offset

const sumOffsets = (o1: Offset, o2: Offset): Offset => ({
  left: o1.left + o2.left,
  top: o1.top + o2.top
})

const PieceFigure = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'center',
  width: '100%',
  variants: {
    figureSize: {
      'normal': {
        ...IMAGE_OFFSET
      },
      'large': {
        ...IMAGE_OFFSET_LARGER
      }
    }
  }
})

const ShadowFigure = styled(Text, {

  fontWeight: '600', 
  textAlign: 'center',
  textAlignVertical: 'top',
  width: '100%',
  position: 'absolute',
  variants: {
    variant: {
      normal: {
        ...sumOffsets(IMAGE_OFFSET, {left: 2, top: 2}),
      },
      large: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 2, top: 2}),
      },
      effectRt1: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 1.5, top: 2.5}),
      },
      effectRt2: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: 3, top: 3}),
      },
      effectLt1: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: -2.5, top: 0}),
      },
      effectLt2: {
        ...sumOffsets(IMAGE_OFFSET_LARGER, {left: -4.5, top: 1}),
      }
    }
  }
})

  // https://stackoverflow.com/questions/51611619/text-with-solid-shadow-in-react-native 
const Shadows: React.FC<{
  descs: ShadowDesc[]
  css?: CSS
} & PropsWithChildren> = ({
  descs,
  css,
  children
}) => (<>
  {descs.map((d, i) => (
    <ShadowFigure css={{...css, color: d.color}} variant={d.variant} key={i}>{children}</ShadowFigure> 
  ))}
</>)

    // Size is safe, since if the layout-based size is unavailable,
    // this component won't be rendered.
const Piece: React.FC<{  
  square: ObsSquare 
  size: number 
  css?: CSS
}> = observer(({
  square,
  size,
  css
}) => {

  const pulses = usePulses()
  const theme = useTheme()

  if (!square.piece) {
    return null
  }

  const { 
    fontSize, 
    figureSize, 
    shadows
  } = ((): {
    fontSize: number 
    figureSize: 'normal' | 'large' 
    shadows: ShadowDesc[]
  } => {

    if (square.squareState === 'kingInCheck' && pulses.slow ) {
      return { 
        fontSize: size * .9, 
        figureSize: 'large', 
        shadows: IN_CHECK_SHADOWS 
      }
    } 
    if (square.squareState === 'inCheckFrom' && !pulses.slow) {
      return { 
        fontSize: size * .95, 
        figureSize: 'large', 
        shadows: IN_CHECK_SHADOWS 
      }
    } 
      // in 'capturePromote' case, the square will pulse w a yellow border as well.
    else if (square.squareState.includes('capture') && pulses.fast) {
      return { 
        fontSize: size * .9, 
        figureSize: 'large', 
        shadows: CAPTURE_SHADOWS 
      }
    } 
    else if (square.squareState === 'castleRookFrom' && pulses.slow) {
        // pulse larger
      return {
        fontSize: size * .9, 
        figureSize: 'large',
        shadows: [ { variant: 'large', color: NORMAL_SHADOW_COLOR[square.piece.side] }]
      }
    }
      // Default size and shadows
    return {
      fontSize: size *.8,
      figureSize: 'normal',
      shadows: [ { variant: 'normal', color: NORMAL_SHADOW_COLOR[square.piece.side] }]
    }
  })()

  const height = fontSize * 1.1 // ensure no clipping 
  const color = (square.piece.side === 'white') ? theme.colors.pieceColorWhite : theme.colors.pieceColorBlack

    // android bug: https://stackoverflow.com/questions/41943191/how-to-use-zindex-in-react-native
  return (
    <Box css={{...css, w: '100%', h: '100%' }} >
      <Shadows descs={shadows} css={{ fontSize, height }} >
        {PIECETYPE_TO_UNICODE[square.piece.type]}
      </Shadows> 
      <PieceFigure figureSize={figureSize} css={{ fontSize, height, color }} >
        {PIECETYPE_TO_UNICODE[square.piece.type]}
      </PieceFigure>
    </Box>
  ) 
})

export default Piece
