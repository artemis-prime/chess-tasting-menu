import React from 'react'
import { type ViewStyle, type StyleProp } from 'react-native'
import Animated, { 
  type SharedValue, 
  useAnimatedStyle,
} from 'react-native-reanimated'

import { useTheme, deborder as deb } from '~/style'
import { ImageButton } from '~/primatives'

const LogoButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle> // must be this form
}> = ({
  onClick,
  disabled,
  style
}) => {

  const theme = useTheme()
  return (
    <ImageButton
      defaultImageURI='knight_logo_80_normal'
      disabledState={{containerStyle: { opacity: 0.7 }}}
      onClick={onClick}
      disabled={disabled}
      containerStyle={[
        style,
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.pieceColorWhite
        }
      ]}
      imageStyle={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

const AnimatedLogoButton: React.FC<{
  onClick: () => void
  animBase: SharedValue<number>
  style?: StyleProp<ViewStyle>
}> = ({
  onClick,
  animBase,
  style
}) => (
  <Animated.View style={[
    style,
    {
      position: 'absolute',
      width: 40,
      height: 40,
    },
    useAnimatedStyle<ViewStyle>(() => ({
      opacity: animBase.value,
      display: animBase.value < 0.1 ? 'none' : 'flex'
    })) 
  ]}>
    <LogoButton onClick={onClick} />
  </Animated.View>
)

export default AnimatedLogoButton
