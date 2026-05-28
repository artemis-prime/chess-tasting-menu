import { View } from 'react-native'

import { styled } from '~/style'

const SideSwatch = styled(View, {

  h: '$swatchHNormal', 
  w: '$swatchWNormal',
  borderRadius: '$sm',
  borderWidth: '$thicker',
  borderColor: '#777',

  variants: {
    side: {
      white: {
        backgroundColor: '$pieceColorWhite'
      },
      black: {
        backgroundColor: '$pieceColorBlack'
      },
    },
    small: {
      true: {
        borderWidth: '$normal',
        h: '$swatchHSmall', 
        w: '$swatchWSmall',
      }
    },
    narrow: {
      true: {
        h: '$swatchHSmall', 
        // width is set dynamically
        borderWidth: '$normal', 
      }
    }

  }
})

export default SideSwatch
