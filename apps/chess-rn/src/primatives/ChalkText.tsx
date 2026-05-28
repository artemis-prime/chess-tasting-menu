import { Text } from 'react-native'

import { styled } from '~/style'

const ChalkText = styled(Text, {

  fontFamily: '$chalkboardFont',
  color: '$chalkboardTextColor',

  variants: {
    size: {
      normal: {
        lineHeight: '$lineHeightChalkboardNormal',
        fontSize: '$fontSizeNormal',
      },
      larger: {
        lineHeight: '$lineHeightChalkboardNormal',
        fontSize: '$fontSizeLarger',
      },
      smaller: {
        lineHeight: '$lineHeightChalkboardSmaller',
        fontSize: '$fontSizeSmaller',
      },
      small: {
        lineHeight: '$lineHeightChalkboardSmall',
        fontSize: '$fontSizeSmall',
        textAlignVertical: 'bottom',
      },
      short: {
        height: '$lineHeights$lineHeightChalkboardSmall',
        lineHeight: '$lineHeightChalkboardShort',
        fontSize: '$fontSizeSmaller',
        textAlignVertical: 'bottom',
      }
    },
    alert: {
      true: {
        color: '$alert8'
      },
      false: {}
    }  
  },
  defaultVariants: {
    size: 'normal',
    alert: 'false'
  }
})

export default ChalkText
