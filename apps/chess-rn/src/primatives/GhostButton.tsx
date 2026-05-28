import React, { type PropsWithChildren } from 'react'
import { 
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { type CSS, styled, useTheme, typography } from '~/style'

import ButtonBase, {type ButtonViewProps} from './ButtonBase'

const ButtonText = styled(Text, {

  variants: {
    disabled: { true: {} },
    pressed: { true: {} },
    on: { true: {} },
    chalkboard: {
      true: { ...typography.chalkboard.normal }
    },
    menu: {
      true: { ...typography.menu.sectionTitle }
    },
  },
  compoundVariants: [
    {
      chalkboard: true,
      disabled: true,
      css: { color: '$chalkboardTextColorDisabled' }
    },
    {
      menu: true,
      disabled: true,
      css: { color: '$menuTextColorDisabled' }
    },
  ]
})

const GhostButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  menu?: boolean
  chalkboard?: boolean
  containerStyle?: StyleProp<ViewStyle>
  textCss?: CSS
} & PropsWithChildren> = ({
  children,
  containerStyle,
  onClick,
  disabled,
  menu,
  chalkboard,
  textCss
}) => {
  
  const theme = useTheme()
  return (
    <ButtonBase 
      onPressAnimations={[{
        prop: 'backgroundColor',
        from: (menu) ? theme.colors.menuBGColor : 'rgba(0, 0, 0, 0)',
        to: (menu) ? theme.colors.menuBGColorPressed : theme.colors.chalkboardButtonPressedBG 
      }]}
      view={ButtonText as React.ComponentType<ButtonViewProps>}
      onClick={onClick}
      containerStyle={[
        {borderRadius: theme.radii.menuRadius},
        containerStyle 
      ]}  
      disabled={disabled}
      viewProps={{
        menu, 
        chalkboard,
        css: textCss
      }}
    >
      {children}
    </ButtonBase>
  )
}

export default GhostButton
