import React, { type PropsWithChildren } from 'react'
import { Text } from 'react-native'

import { typography, deborder, styled, useTheme } from '~/style'

import { Row, ButtonBase } from '~/primatives'

const UNI = {
  checkedBallot: '\u2611',
  uncheckedBallot: '\u2610',
  checkmark: '\u2713'
}

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

const MenuCheckboxItem: React.FC<
  {
    checked: boolean
    setChecked: (b: boolean) => void
    disabled?: boolean
    icon?: WidgetIconDesc
  } 
  & PropsWithChildren
> = ({
  checked,
  setChecked,
  disabled,
  icon,
  children
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: theme.space[1],
        paddingRight: theme.space[1],
        borderRadius: theme.radii.menuRadius,
      }}
      on={checked}
      disabled={disabled}
      onClick={setChecked}
    >
      <Row>
        {icon && <WidgetIcon disabled={disabled} icon={icon} />}
        <ItemText disabled={disabled} icon={!!icon}>{children}</ItemText>
      </Row>
      <WidgetIcon state='default' icon={{icon: UNI.checkmark, style: {
        textAlign: 'right',
        fontSize: 20,
        top: 2,
        left: 7,
        opacity: checked ? 0.8 : 0,
        fontWeight: '300'
      }}} />
    </ButtonBase>
  )
}
export default MenuCheckboxItem
