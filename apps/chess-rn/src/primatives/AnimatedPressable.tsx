import React, { useEffect, type PropsWithChildren }  from 'react'
import { 
  Pressable,
  type PressableProps,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
  type ImageStyle,
  type ColorValue,
} from 'react-native'
import Animated, { 
  useSharedValue, 
  Easing, 
  withTiming,
  useDerivedValue,
  useAnimatedStyle,
  interpolateColor,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated'

import { isValidNumericStyleProp } from '~/style'

type ViewProp = keyof ViewStyle 
type ImageProp = keyof ImageStyle 
interface ViewPropAnimation {
  prop: ViewProp 
  from: string | number
  to: string | number
}

interface ImagePropAnimation {
  prop: ImageProp 
  from: string | number
  to: string | number
}

interface AnimatedPressableProps {
  animations: ViewPropAnimation[]
  duration?: number
  fireClickAfterAnimation?: boolean
  style?: StyleProp<ViewStyle>
  onClick: () => void
}

const AnimatedPressable: React.FC<
  AnimatedPressableProps
  & Omit<PressableProps, 'onPressIn' | 'onPressOut' | 'onPress' | 'children'>
  & PropsWithChildren
> = ({
  style,
  children,
  animations,
  duration,
  onClick,
  fireClickAfterAnimation = false,
  ...rest
}) => {
  
  const animBase = useSharedValue<number>(0)

  const animate = (pressingIn: boolean) => {
    animBase.value = withTiming(
      pressingIn ? 1 : 0, 
      { duration: duration ?? 50, easing: pressingIn ? Easing.out(Easing.linear) : Easing.in(Easing.linear) },
      () => { runOnJS(animationEnded)(pressingIn) }
    )
  }
  const animationEnded = (pressedIn: boolean) => {
    if (fireClickAfterAnimation && !pressedIn) {
      onClick()
    }
  }

  useEffect(() => {
    animations.forEach((a: ViewPropAnimation) => {
      if (typeof a.from === 'string') {
        if (!a.prop.endsWith('olor')) {
          throw new Error('AnimatedPressable: Unrecognized color property!')
        }
      }
      else {
        if (!isValidNumericStyleProp(a.prop)) {
          throw new Error('AnimatedPressable: Unrecognized numeric property!')
        }
      }
    })
  }, [])

  const onPressIn = (e: GestureResponderEvent): void => { animate(true) }
  const onPressOut = (e: GestureResponderEvent): void => { animate(false) }
  const onPress = (e: GestureResponderEvent): void => { if (!fireClickAfterAnimation) { onClick() } } 

  const animStyle = useAnimatedStyle<ViewStyle>(() => {
    const result: any = {}
    animations.forEach((a: ViewPropAnimation) => {
      if (typeof a.from === 'string') {
        result[a.prop] = interpolateColor(      
          animBase.value, 
          [0, 1], 
          [a.from, a.to as string]
        ) as ColorValue 
      }
      else {
        result[a.prop as ViewProp] = interpolate(      
          animBase.value, 
          [0, 1], 
          [a.from, a.to as number],
          { extrapolateRight: Extrapolation.CLAMP }
        )
      }
    })
    return result as ViewStyle
  })

  const styleArray: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>> = 
    (Array.isArray(style)) ? [...style, animStyle] : [style, animStyle]

  return ( 
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} {...rest}>
      <Animated.View style={styleArray}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////

interface AnimatedPressableImageProps {
  imageURI: string
  containerAnimations: ViewPropAnimation[]
  imageAnimations: ImagePropAnimation[]
  duration?: number
  containerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  setPressed?: (p: boolean) => void
}

const AnimatedPressableImage: React.FC<
  AnimatedPressableImageProps
  & Omit<PressableProps, 'onPressIn' | 'onPressOut' | 'children'>
  & PropsWithChildren
> = ({
  imageURI,
  containerStyle,
  imageStyle,
  children,
  containerAnimations,
  imageAnimations,
  duration,
  setPressed,
  ...rest
}) => {
  
  const pressed = useSharedValue<boolean>(false)

  const animBase = useDerivedValue(() => {
    return withTiming(
      pressed.value ? 1 : 0, 
      { 
        duration : duration ?? 50, 
        easing: pressed.value ? Easing.out(Easing.linear) : Easing.in(Easing.linear) 
      }
    )
  }) 

  useEffect(() => {
    containerAnimations.forEach((a: ViewPropAnimation) => {
      if (typeof a.from === 'string') {
        if (!a.prop.endsWith('olor')) {
          throw new Error('AnimatedPressable: Unrecognized color property!')
        }
      }
      else {
        if (!isValidNumericStyleProp(a.prop)) {
          throw new Error('AnimatedPressable: Unrecognized numeric property!')
        }
      }
    })
    imageAnimations.forEach((a: ImagePropAnimation) => {
      if (typeof a.from === 'string') {
        if (!a.prop.endsWith('olor')) {
          throw new Error('AnimatedPressable: Unrecognized color property!')
        }
      }
      else {
        if (!isValidNumericStyleProp(a.prop)) {
          throw new Error('AnimatedPressable: Unrecognized numeric property!')
        }
      }
    })
  }, [])

  const onPressIn = (e: GestureResponderEvent): void => { 
    pressed.value = true;
    if (setPressed) {
      setPressed(true)
    } 
  }
  const onPressOut = (e: GestureResponderEvent): void => { 
    pressed.value = false 
    if (setPressed) {
      setPressed(false)
    } 
  }

  const viewAnimStyle = useAnimatedStyle<ViewStyle>(() => {
    const result: any = {}
    containerAnimations.forEach((a: ViewPropAnimation) => {
      if (typeof a.from === 'string') {
        result[a.prop] = interpolateColor(      
          animBase.value, 
          [0, 1], 
          [a.from, a.to as string]
        ) as ColorValue 
      }
      else {
        result[a.prop as ViewProp] = interpolate(      
          animBase.value, 
          [0, 1], 
          [a.from, a.to as number],
          { extrapolateRight: Extrapolation.CLAMP }
        )
      }
    })
    return result as ViewStyle
  })

  const imageAnimStyle = useAnimatedStyle<ImageStyle>(() => {
    const result: any = {}
    imageAnimations.forEach((a: ImagePropAnimation) => {
      if (typeof a.from === 'string') {
        result[a.prop] = interpolateColor(      
          animBase.value, 
          [0, 1], 
          [a.from, a.to as string]
        ) as ColorValue 
      }
      else {
        result[a.prop as ViewProp] = interpolate(      
          animBase.value, 
          [0, 1], 
          [a.from, a.to as number],
          { extrapolateRight: Extrapolation.CLAMP }
        )
      }
    })
    return result as ImageStyle
  })

  const viewStyleArray: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>> = 
    (Array.isArray(containerStyle)) ? [...containerStyle, viewAnimStyle] : [containerStyle, viewAnimStyle]

  const imageStyleArray: StyleProp<Animated.AnimateStyle<StyleProp<ImageStyle>>> = 
    (Array.isArray(imageStyle)) ? [...imageStyle, imageAnimStyle] : [imageStyle, imageAnimStyle]

  return ( 
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} {...rest}>
      <Animated.View style={viewStyleArray}>
        <Animated.Image style={imageStyleArray} source={{uri: imageURI}}/>
      </Animated.View>
    </Pressable>
  )
}


export {
  AnimatedPressable as default,
  AnimatedPressableImage, 
  type ViewPropAnimation,
  type ImagePropAnimation,
  type AnimatedPressableProps,
  type AnimatedPressableImageProps,
}
