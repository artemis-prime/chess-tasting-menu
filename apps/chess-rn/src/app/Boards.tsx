import React, { useEffect } from 'react'
import { type ViewStyle } from 'react-native'
import { observer } from 'mobx-react-lite'

import Animated, { 
  Extrapolation,
  interpolate,
  type SharedValue, 
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated'

import { useTheme, deborder } from '~/style'
import { useChalkboard, useMenu, useViewport } from '~/services'

import Chalkboard from './Chalkboard'
import Chessboard from './Chessboard'
import { Box } from '~/primatives'
import { autorun } from 'mobx'

const Boards: React.FC<{
  animBase: SharedValue<number>
  toggleMenu: () => void
}> = observer(({
  animBase : menuAnimBase,
  toggleMenu,
}) => {
  const theme = useTheme()
  const menu = useMenu()
  const cb = useChalkboard()
  const viewport = useViewport()

  const cbAnimBase = useSharedValue<number>(cb.open ? 1 : 0) 
  const landscape = useSharedValue<boolean>(viewport.landscape)

    // SharedValue is can be accessed from worklet in useAnimatedStyle(),
    // while mobx state cannot.
  useEffect(() => (autorun(() => {
    landscape.value = viewport.landscape     
  })), [])

    // state changes at the end of the animiation
  const animate = (opening: boolean) => {
    const onFinished = () => { cb.setOpen(opening) }
    cbAnimBase.value = withTiming(
      opening ? 1 : 0,
      {
        duration: 200,  
        easing: opening ? Easing.out(Easing.linear) : Easing.in(Easing.linear) 
      },
      () => { runOnJS(onFinished)() }
    )
  }

  const setOpen = (b: boolean) => { animate(b) }

  const ChalkboardOuterPortrait: React.FC = () => (
    <Animated.View 
      collapsable={false} 
      style={[
        {
          ...deborder('yellow', 'layoutInner'),
          minHeight: 100,
          flexBasis: 100,
          flexShrink: 0,
        },
        useAnimatedStyle(() => ({
          flexGrow: cbAnimBase.value,
        }))
      ]}
    >
      <Chalkboard 
        disableInput={menu.open} 
        visible={menu.open} 
        toggleMenu={toggleMenu} 
        animBaseForButton={menuAnimBase}
        open={cb.open}
        setOpen={setOpen}
        css={{ position: 'absolute', t: 0, b: 0, r: 0, l: 0 }}
      />
    </Animated.View>
  )

  const ChalkboardOuterLandscape: React.FC = () => (
    <Box 
      collapsable={false} 
      css={{
        ...deborder('yellow', 'layoutInner'),
        flexShrink: 0,
        flexGrow: 1, 
        flexDirection: 'column',         
      }}
    >
      <Animated.View 
        collapsable={false} 
        style={[
          {
            ...deborder('red', 'layoutInner'),
            minHeight: 100,
            flexBasis: 100,
            flexShrink: 0,
          },
          useAnimatedStyle(() => ({
            flexGrow: cbAnimBase.value,
          }))
        ]}
      >
        <Chalkboard 
          disableInput={menu.open} 
          visible={menu.open} 
          toggleMenu={toggleMenu} 
          animBaseForButton={menuAnimBase}
          open={cb.open}
          setOpen={setOpen}
          css={{ position: 'absolute', t: 0, b: 0, r: 0, l: 0 }}
        />
      </Animated.View>
    </Box>
  )

  return (
    <Animated.View style={[
      {
        flexDirection: viewport.landscape ? 'row' : 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexGrow: 1,
        paddingHorizontal: theme.space[1],
        paddingBottom: theme.space[1],
        gap: theme.space['1_5'], 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: '#444',
        ...deborder('orange', 'layoutInner' ),
      }, 
      useAnimatedStyle<ViewStyle>(
        () => ({
          borderTopLeftRadius: interpolate(
            menuAnimBase.value, 
            [0, 1], 
            [0, theme.radii.md], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
          borderWidth: interpolate(
            menuAnimBase.value, 
            [0, 1], 
            [0, theme.borderWidths.thicker], 
            { extrapolateRight: Extrapolation.CLAMP }
          ),
          paddingTop: (landscape.value) ? theme.space[1] : interpolate(
            menuAnimBase.value, 
            [0, 1], 
            [0, theme.space[1]], 
            { extrapolateRight: Extrapolation.CLAMP }
          )
        }) 
      ) 
    ]}>
      { viewport.landscape ? (
        <ChalkboardOuterLandscape />
      ) : (
        <ChalkboardOuterPortrait />
      )}
      <Chessboard css={{flex: 0, ...deborder('lightgreen', 'layoutInner' ) }} disableInput={menu.open} />

    </Animated.View>
  )
})

export default Boards
