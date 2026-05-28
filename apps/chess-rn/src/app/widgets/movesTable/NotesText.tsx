import { Text } from 'react-native'

import { styled } from '~/style'

const NotesText = styled(Text, {

  fontFamily: '$chalkboardFont',
  color: '$chalkboardTextColor',
  //height: '$lineHeights$lineHeightChalkboardSmall',
  lineHeight: '$lineHeightChalkboardShort',
  fontSize: '$fontSizeSmaller',
  textAlignVertical: 'bottom',
  flexDirection: 'row',

  variants: {
    alert: { true: { color: '$alert8' } },  
    severe: { true: { color: '$alert9' } },  
    disabled: { true: { color: '$chalkboardTextColorDisabled' } }  
  },
})

export default NotesText
