import React from 'react'
import { StatusBar, View } from 'react-native'
import { 
  Easing, 
  withTiming,
  runOnJS,
  useSharedValue, 
} from 'react-native-reanimated'
import { observer } from 'mobx-react-lite'

import { useMenu, useMeasuredStatusBar, useViewport } from '~/services'
import { styled, deborder as deb, useTheme } from '~/style'
import { LogoButton } from '~/app/widgets'

import GameArea from './GameArea'
import Menu from './Menu'
const ANIM_DURATION = 100 // in ms

const Main = styled(View, {
  height: '100%', 
  backgroundColor: '$menuBGColor', 
  ...deb('orange', 'layout')
})

const App: React.FC = observer(() => {

  const menu = useMenu()
  const th = useTheme()
  const vp = useViewport()
  const onLayout = useMeasuredStatusBar()

    // 0 (menu closed) <--> 1 (menu open)   
    // menu.visible is updated at the END of the animation.
  const animBase = useSharedValue<number>(menu.open ? 1 : 0) 

    // Not a 'worklet', but the end callback is! 
    // It also can't be defined inline for some odd reason.
    // (reanimated babel plugin issue?).
  const toggleMenu = () => {
    const actualToggle = () => { menu.setOpen(!menu.open) }
    animBase.value = withTiming(
      menu.open ? 0 : 1, 
      { 
        duration: ANIM_DURATION, 
        easing: menu.open ? Easing.out(Easing.linear) : Easing.in(Easing.linear) 
      },
      () => { runOnJS(actualToggle)() } // called at end
    )
  }

  return (
    <Main onLayout={onLayout}>
      <StatusBar translucent={true} barStyle='light-content' backgroundColor='transparent' />
      <Menu animBase={animBase} />
      <GameArea animBase={animBase} toggleMenu={toggleMenu} />
      <LogoButton animBase={animBase} onClick={toggleMenu} style={{ 
        right: th.space['1_5'], 
        top: vp.statusBarHeight + th.space['1_5'] 
      }}/>
    </Main>
  )
})

export default App
