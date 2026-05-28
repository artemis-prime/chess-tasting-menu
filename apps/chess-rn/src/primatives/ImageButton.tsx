import React from 'react'
import { 
  type StyleProp,
  Image,
  type ViewStyle,
  type ImageStyle,
  type GestureResponderEvent,
} from 'react-native'

import { useTheme } from '~/style'

import { AnimatedPressableImage, type ImagePropAnimation, type ViewPropAnimation } from './AnimatedPressable'


interface ImageButtonState {
  imageURI?: string
  imageStyle?: ImageStyle
  containerStyle?: ViewStyle
}

const ImageButton: React.FC<{
    // If 'on' is provided, this will
    // be called with the value toggled 
  onClick: ((on: boolean) => void) | (() => void) 
  defaultImageURI: string
  disabledState?: ImageButtonState
  onState?: ImageButtonState
  disabled?: boolean
  on?: boolean
  imageStyle?: StyleProp<ImageStyle> 
  containerStyle?: StyleProp<ViewStyle> 
  onPressImageAnimations?: ImagePropAnimation[]
  onPressContainerAnimations?: ViewPropAnimation[]
}> = ({
  defaultImageURI,
  disabledState,
  onState,
  onClick,
  disabled,
  on,
  imageStyle,
  containerStyle,
  onPressImageAnimations,
  onPressContainerAnimations
}) => {
  if (on !== undefined && onState === undefined) {
    throw new Error("ImageButton: Must provide an 'on' state if using 'on / off'!")
  }
  if (disabled && disabledState === undefined) {
    throw new Error("ImageButton: Must provide a 'disabled' state if using the disabled state!")
  }

  let imageURI = defaultImageURI
  let imageStateStyle: ImageStyle = {}
  let containerStateStyle: ViewStyle = {}
  if (disabled) {
    if (disabledState!.imageURI) {
      imageURI =  disabledState!.imageURI 
    }
    if (disabledState!.imageStyle) {
      imageStateStyle =  disabledState!.imageStyle 
    }
    if (disabledState!.containerStyle) {
      containerStateStyle =  disabledState!.containerStyle 
    }
  }
  else if (on) {
    if (onState!.imageURI) {
      imageURI =  onState!.imageURI 
    }
    if (onState!.imageStyle) {
      imageStateStyle =  onState!.imageStyle 
    }
    if (onState!.containerStyle) {
      containerStateStyle =  onState!.containerStyle 
    }
  }

  const onPress = (ignore: GestureResponderEvent) => {
    if (on === undefined) {
      (onClick as () => void)()
    }
    else {
      (onClick as (b: boolean) => void)(!on)  
    }
  }

  return (
    <AnimatedPressableImage 
      imageURI={imageURI}
      imageAnimations={onPressImageAnimations ?? [{
        prop: 'opacity',
        from: 1,
        to: 0.5
      }]}
      containerAnimations={onPressContainerAnimations ?? []}
      containerStyle={[containerStyle, containerStateStyle]}
      imageStyle={[imageStyle, imageStateStyle]}
      disabled={disabled}
      onPress={onPress}
    />
 )
}

export default ImageButton
