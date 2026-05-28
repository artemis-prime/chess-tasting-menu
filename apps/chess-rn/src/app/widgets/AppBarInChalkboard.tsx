import React from 'react'
import { View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

import { styled, type CSS, useTheme, deborder } from '~/style'

import type MenuControlProps from './MenuControlProps'
import BurgerToChevronButton from './BurgerToChevronButton'
import UndoRedoWidget from './UndoRedoWidget'

const AppBarOuter = styled(View, {
  flexDirection: 'row', 
  justifyContent: 'space-between', 
  alignItems: 'stretch',
  h: '$appBarHeight', 
  w: '100%', 
  backgroundColor: '$menuBGColor',
  borderBottomWidth: 0.5,
  borderBottomColor: 'gray',
})

const AppBarInChalkboard: React.FC<{
  animBaseForButton?: SharedValue<number>
  css?: CSS
} & MenuControlProps> = ({
  animBaseForButton,
  css,
  visible,
  toggleMenu
}) => {

  const theme = useTheme()
  const setOn = (b: boolean) => { toggleMenu() }

  return ( 
    <AppBarOuter css={{...css, ...deborder('red', 'header')}}>
      <BurgerToChevronButton 
        style={{
          borderRadius: theme.radii.sm, 
          paddingLeft: theme.space['1_5'],
          paddingRight: theme.space['1_5'],
          height: '100%',
          ...deborder('green', 'header')
        }}
        animBase={animBaseForButton}
        burger={!visible}
        setBurger={setOn}
      />
      <UndoRedoWidget menu css={deborder('yellow', 'header')}/>
    </AppBarOuter>
  )
}

export default AppBarInChalkboard
