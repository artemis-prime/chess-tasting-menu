import React, { useEffect } from 'react'
import {
  StatusBar,
  type ViewStyle,
  type ImageStyle,
} from 'react-native'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import Animated, { 
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue, 
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import { useTheme, layout, deborder } from '~/style'
import { BGImage } from '~/primatives'
import { useViewport } from '~/services'

import Boards from './Boards'

const GameArea: React.FC<{
  toggleMenu: () => void
  animBase: SharedValue<number>
}> = observer(({
  toggleMenu,
  animBase,
}) => {

  const v = useViewport()
  const fraction = v.landscape ? layout.landscape.openMenu.xFraction : layout.portrait.openMenu.xFraction
  const left = useSharedValue<number>(v.w * fraction)
  const top = useSharedValue<number>(v.landscape ? layout.landscape.openMenu.yOffset : layout.portrait.openMenu.yOffset)

  useEffect(() => {
    return autorun(() => {
      left.value = v.w * (v.landscape ? layout.landscape.openMenu.xFraction : layout.portrait.openMenu.xFraction)
      top.value = v.landscape ? layout.landscape.openMenu.yOffset : layout.portrait.openMenu.yOffset
    })
  }, [])

  return (
    <Animated.View style={[
      {
        position: 'absolute',
        width: '100%',
        height: '100%',
        //...deborder('white', 'layout')
      }, 
      useAnimatedStyle<ViewStyle>(
        () => ({
          left: interpolate(
            animBase.value, 
            [0, 1], 
            [0, left.value], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
          top: interpolate(
            animBase.value, 
            [0, 1], 
            [0, top.value], 
            { extrapolateRight: Extrapolation.CLAMP }
          )
        }) 
      )
    ]}>
      <BGImage 
        imageURI={'chess_bg_1920_low_res'} 
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          flexGrow: 1,
          ...deborder('purple', 'layout'),
        }}
      >
        <StatusBarSpacer animBase={animBase} />
        <CornerShim animBase={animBase} />
        <Boards animBase={animBase} toggleMenu={toggleMenu} />
      </BGImage>
    </Animated.View>
  )
})

const StatusBarSpacer: React.FC<{
  animBase: SharedValue<number>
}> = observer(({
  animBase 
}) => {
  const theme = useTheme()
  const viewport = useViewport()
  return (
    <Animated.View style={[
      {
        //width: '100%', 
        flex: 0,
        height: viewport.statusBarHeight,
        ...deborder('lightgreen', 'layout')
      }, 
      useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(      
          animBase.value, 
          [0, 1], 
          ['rgba(0, 0, 0, 0.2)', theme.colors.menuBGColor ]
        )
      }))
    ]}/>
  )
})

  // Creates the appearance of border radius though only
  // siblings are involved.  Yes, I tried everything else, 
  // believe you me!  Yessiree
const CornerShim: React.FC<{
  animBase: SharedValue<number>
}> = ({
  animBase  
}) => (
    // Size is half the resolution since image was captured at double density/
    // (ok for both case)
  <Animated.Image 
    source={{uri: 'menu_corner_shim_14x14'}} 
    resizeMode='cover'
    style={[
      {
        position: 'absolute',
        width: 7, 
        height: 7,
        left: 0,
        top: StatusBar.currentHeight!
      },
      useAnimatedStyle<ImageStyle>(() => ({
        opacity: animBase.value
      }))
    ]} 
  />
)

export default GameArea
