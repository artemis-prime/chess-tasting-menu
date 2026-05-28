import React  from 'react'
import { 
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import Animated, { 
  type SharedValue, 
  useAnimatedStyle, 
  Extrapolation, 
  interpolate 
} from 'react-native-reanimated'

import { styled, useTheme, deborder } from '~/style'
import { ButtonBase } from '~/primatives'

const icons = {
  burger: '\u2630',
  arrowToCornerDownRight: '\u21F2',
  arrowToCornerUpLeft:'\u21F1'
}

const Figure = styled(Text, {
  ...deborder('yellow', 'header'),
  color: 'white',
  fontWeight: "900",
})

const commonStyles = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
} as ViewStyle

  /*
      If animBase is provided, than we cross-fade between the Figures 
      that are contained in two Animated.View's (via opacity and display: none).
      If not, then we just show one or the other.
  */
const BurgerToChevronButton: React.FC<{
  burger: boolean
  setBurger: (b: boolean) => void
  disabled?: boolean
  animBase?: SharedValue<number>
  style?: StyleProp<ViewStyle>
}> = ({
  burger,
  setBurger,
  disabled,
  animBase,
  style
}) => {

  const theme = useTheme()

  return ( 
    <ButtonBase 
      on={burger}
      onClick={setBurger} 
      disabled={disabled}
      containerStyle={[
        style,
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: theme.space.spaceAppBarHeight
        }
      ]}
      onPressAnimationDuration={5}
      fireClickAfterAnimation={true}
      onPressAnimations={[{
        prop: 'backgroundColor',
        from: theme.colors.menuBGColor,
        to: theme.colors.menuBGColorPressed 
      }]}
    >
    {animBase ? (<>
      <Animated.View style={[
        commonStyles,
        useAnimatedStyle<ViewStyle>(() => ({
          opacity: interpolate(animBase.value, [0, 1], [1, 0], { extrapolateRight: Extrapolation.CLAMP }),
          display: animBase.value > 0.9 ? 'none' : 'flex'
        }))
      ]}>
        <Figure css={{fontSize: 23}}>{icons.burger}</Figure>  
      </Animated.View>
      <Animated.View style={[
        commonStyles,
        useAnimatedStyle<ViewStyle>(() => ({
          opacity: animBase.value,
          display: animBase.value < 0.1 ? 'none' : 'flex'
        }))
      ]}>
        <Figure css={{fontSize: 30, t: -2, l: -1}}>{icons.arrowToCornerUpLeft}</Figure>
      </Animated.View>
    </>) 
    : (burger ? (
        <Figure css={{fontSize: 23}}>{icons.burger}</Figure>  
    ) : (
      <Figure css={{fontSize: 30, t: -2, l: -1}}>{icons.arrowToCornerUpLeft}</Figure>
    ))}
    </ButtonBase>
  )
}
export default BurgerToChevronButton

