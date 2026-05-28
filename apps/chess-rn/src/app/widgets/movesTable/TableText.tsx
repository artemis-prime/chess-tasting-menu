import { Text } from 'react-native'

import { styled } from '~/style'

const TableText = styled(Text, {

  color: '$chalkboardTextColor',
  fontFamily: '$chalkboardFont',
  lineHeight: '$lineHeightChalkboardSmall',
  fontSize: '$fontSizeSmall',
  textAlignVertical: 'bottom',

  variants: {
    alert: { true: { color: '$alert8' } },  
    severe: { true: { color: '$alert9' } },  
    disabled: { true: { color: '$chalkboardTextColorDisabled' } }  
  },
})

export default TableText
