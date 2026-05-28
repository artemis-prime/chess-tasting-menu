import React, { type PropsWithChildren } from 'react'
import { Text } from 'react-native'

import { typography, deborder, styled, useTheme } from '~/style'

import {  
  ButtonBase,
  type ButtonViewProps,
} from '~/primatives'

import WidgetIcon, {
  IconWidth,
  IconMargin
} from './WidgetIcon' 
import type WidgetIconDesc from './WidgetIconDesc'


const ItemText = styled(Text, {

  ...deborder('orange', 'menu'),
  ...typography.menu.item,
  variants: {
    disabled: { true: {color: '$menuTextColorDisabled'}},
    icon: { false: { ml: IconWidth + IconMargin } }
  },
})

const MenuItem: React.FC<{
  onClick: () => void
  disabled?: boolean
  icon?: WidgetIconDesc
} & PropsWithChildren> = ({
  children,
  disabled,
  onClick,
  icon
}) => {

  const theme = useTheme()
  
  return (
    <ButtonBase 
      onPressAnimations={[{
        prop: 'backgroundColor',
        from: theme.colors.menuBGColor,
        to: theme.colors.menuBGColorPressed 
      }]}
      containerStyle={{
        ...deborder('white', 'menu'),
        height: theme.lineHeights.lineHeightMenu,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: theme.space[1],
        paddingRight: theme.space[1],
        borderRadius: theme.radii.menuRadius,
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <WidgetIcon disabled={disabled} icon={icon} />}
      <ItemText disabled={disabled} icon={!!icon}>
        {children}
      </ItemText>
    </ButtonBase>
  )
}
export default MenuItem
