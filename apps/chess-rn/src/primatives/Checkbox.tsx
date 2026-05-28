import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { type CSS, styled, useTheme, typography, deborder } from '~/style'

import ButtonBase, {type ButtonViewProps} from './ButtonBase'
import SText from './SText'

const CheckboxText = styled(Text, {

  ...typography.chalkboard.normal,
  height: typography.chalkboard.normal.lineHeight,

  variants: {
    disabled: { true: { color: '$chalkboardTextColorDisabled' } },
    pressed: { true: {} },
    on: { true: {} },
  }
})

const Checkbox: React.FC<{
  checked: boolean
  setChecked: (b: boolean) => void
  disabled?: boolean
  containerStyle?: StyleProp<ViewStyle>
  textCss?: CSS
} & PropsWithChildren> = ({
  checked,
  setChecked,
  disabled,
  containerStyle,
  children,
  textCss
}) => {
  
  const theme = useTheme()
  return (
    <ButtonBase 
      onPressAnimations={[{
        prop: 'backgroundColor',
        from: 'rgba(0, 0, 0, 0)',
        to: theme.colors.chalkboardButtonPressedBG 
      }]}
      on={checked}
      onClick={setChecked}
      containerStyle={[
        containerStyle, 
        {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingVertical: theme.space['_5'], 
          paddingHorizontal: theme.space[1], 
          borderRadius: theme.radii.lg, 
          ...deborder('red', 'checkbox' ),
        },
      ]}  
      disabled={disabled}
      view={CheckboxText as React.ComponentType<ButtonViewProps>}
      viewProps={{ css: textCss }}
    >   
      {/* 
          For some reason, putting the check mark in and out of the tree had an effect on the v alignment of the
          text which was not at all controllable, so there was a jumping effect.  Wrapping it in a separate Text 
          element that stays in the tree solves the issue.  BUT, due to Text element collapsing, you can't control
          opacity on next Text nodes, so you have to hack it using a transparent color.
          cf:  https://github.com/facebook/react-native/issues/1314
      */}
      <>[</> 
      <SText css={{fontSize: 17, color: checked ? '$chalkboardTextColor' : 'rgba(0,0,0,0)'}}>✓</SText> 
      <>] {children}</> 
    </ButtonBase>
  )
}

export default Checkbox
