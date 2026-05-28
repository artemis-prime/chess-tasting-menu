import { View } from 'react-native'

import { styled } from '~/style'

const HR = styled(View, {
  w: '100%',
  h: 1.5,
  opacity: 0.5,
  my: '$_5',
  backgroundColor: '$chalkboardTextColor',

  variants: {
    menu: { true: { backgroundColor: '$menuTextColor' }}
  }

})

export default HR