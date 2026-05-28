import React, { type PropsWithChildren } from 'react'
import { 
  View, 
  Text, 
  type ViewStyle, 
  type StyleProp 
} from 'react-native'
import Animated, { 
  useAnimatedStyle,
  type SharedValue 
} from 'react-native-reanimated'
import { observer } from 'mobx-react-lite'

import { 
  typography, 
  deborder, 
  styled, 
  useTheme, 
  layout 
} from '~/style'
import { useChessboardOrientation, useChess } from '~/services'

import menuIcons from './menu/menuIcons'
import { MenuItem, MenuCheckboxItem, type IconAndStyles } from './menu'
import useViewport from '~/services/useViewport'

const MenuOuter: React.FC<{
  animBase: SharedValue<number> 
  regStyle?: StyleProp<ViewStyle>
} & PropsWithChildren> = observer(({
  animBase,
  regStyle,
  children 
}) => {

  const theme = useTheme()
  const viewport = useViewport()

  return (
    <Animated.View  style={[
      {
        ...deborder('red', 'menuOuter'),
        position: 'absolute',
        left: 0,
        top: viewport.statusBarHeight,
        width: '100%', 
        paddingLeft: theme.space.pxMenu,
        paddingRight: theme.space.pxMenu,
        paddingBottom: theme.space._5,
        marginTop: theme.space._5,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.menuBGColor
      }, 
      regStyle,
      useAnimatedStyle<ViewStyle>(() => ({
        opacity: animBase.value,
      }))
    ]}>
      {children}
    </Animated.View>
  )
})

const MenuSectionTitle = styled(Text, {
  ...typography.menu.sectionTitle,
  borderBottomColor: '$chalkboardTextColor',
  borderBottomWidth: 1,
  pt: '$pyMenuSeparator',
  mb: '$pyMenuSeparator',
  variants: {
    first: { true: {
      pt: '$_5'
    }}
  },
})

const MenuItemsOuter = styled(View, {
  ...deborder('green', 'menu'),
})

const Menu: React.FC<{
  animBase: SharedValue<number> 
  regStyle?: StyleProp<ViewStyle>
}> = observer(({
  animBase,
  regStyle 
}) => {

  const bo = useChessboardOrientation()
  const game = useChess()
  const swapDirection = () => { bo.setWhiteOnBottom(!bo.whiteOnBottom) }
  const vp = useViewport()

  const currentConcedes = (game.currentTurn === 'white') ? '0-1' : '1-0' 
  const widthFraction = vp.landscape ? 
    layout.landscape.openMenu.xFraction : layout.portrait.openMenu.xFraction
  return (
    <MenuOuter animBase={animBase} regStyle={regStyle}>
      <MenuItemsOuter css={{w: vp.w * .9 * widthFraction}}>
        <MenuSectionTitle first>Board Direction</MenuSectionTitle>
        <MenuItem 
          onClick={swapDirection} 
          disabled={bo.autoOrientToCurrentTurn} 
          icon={menuIcons.swap}
        >swap</MenuItem>
        <MenuCheckboxItem 
          checked={bo.autoOrientToCurrentTurn} 
          setChecked={bo.setAutoOrientToCurrentTurn}
          icon={menuIcons.autoSwap}
        >auto-swap</MenuCheckboxItem>
        <MenuSectionTitle>Game</MenuSectionTitle>
        {(game.playing) && (<>
          <MenuItem onClick={game.offerADraw} icon={menuIcons.draw}>offer a draw</MenuItem>
          <MenuItem onClick={game.concede} icon={{icon: currentConcedes, style: (menuIcons.concede as IconAndStyles).style}}>{game.currentTurn} concedes</MenuItem>
        </>)}
        <MenuItem onClick={game.reset} icon={menuIcons.reset}>reset</MenuItem>
      </MenuItemsOuter>
    </MenuOuter>
  )
})

export default Menu
