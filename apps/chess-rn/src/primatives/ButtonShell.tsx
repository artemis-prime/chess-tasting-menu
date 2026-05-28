import React, { type PropsWithChildren, useState } from 'react'
import { 
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type ViewStyle,
  type StyleProp
} from 'react-native'

import { type CSS } from '~/style'

import { type WidgetIconDesc} from '~/app/menu'

type ButtonState = 'normal' | 'pressed' | 'disabled'

interface ButtonViewPropsOld extends PropsWithChildren {
  state: ButtonState
  icon?: WidgetIconDesc 
  css?: CSS
}

interface ButtonShellProps extends 
  Omit<PressableProps, 'onPressIn' | 'onPressOut' | 'children'>, 
  PropsWithChildren 
{
  view: React.FC<ButtonViewPropsOld>
  onClick: () => void
  viewProps?: {[key in string]: any}
  icon?: WidgetIconDesc
  css?: CSS // must have both css and style
  style?: StyleProp<ViewStyle> // must have both css and style
} 

const ButtonShell: React.FC<ButtonShellProps> = ({
  view,
  onClick,
  viewProps,
  disabled = false,
  children,
  ...rest
}) => {

  const [buttonState, setButtonState] = useState<ButtonState>('normal')

  const ButtonView = view // must convert the referenced variable to uppercase

  const onPressIn = (e: GestureResponderEvent): void => {
    setButtonState('pressed')
  }

  const onPressOut = (e: GestureResponderEvent): void => {
    setButtonState('normal')
  }

  const onPress = (e: GestureResponderEvent): void => {
    onClick()
  }

  return (
    <Pressable {...rest} {...{onPressIn, onPressOut, onPress, disabled}} >
      <ButtonView state={(disabled) ? 'disabled' : buttonState} {...rest} {...viewProps}>
        {children}
      </ButtonView>
    </Pressable>
  )
} 

export {
  ButtonShell as default,
  type ButtonViewPropsOld,
  type ButtonState
}
