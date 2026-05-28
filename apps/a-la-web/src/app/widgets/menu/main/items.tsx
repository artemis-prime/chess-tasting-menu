import React from 'react'

import * as Menubar from '@radix-ui/react-menubar'
import { CheckIcon } from '@radix-ui/react-icons'

import { styled, type CSS, menu, deborder } from '~/style'

import {  
  type WidgetIconDesc,
  WidgetIcon,
  EMPTY_ICON,
  IconMargin,
  IconWidth,
  Flex,
} from '~/primatives'

const itemstyles = {

  all: 'unset',
  userSelect: 'none',

  ...menu.menuBarPopupItem,
  ...deborder('white', 'menu'),
  
  display: 'flex',
  alignItems: 'center',
  position: 'relative',

  '&[data-disabled]': {
    color: '$menuTextColorDisabled',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$menuBGColorHover'
  },

  '&:hover': {
    backgroundColor: '$menuBGColorHover'
  },

  '&:active': {
    backgroundColor: '$menuBGColorPressed'
  },

  variants: {
    variant: {
      inset: {
        paddingLeft: 20,
      },
    },
    spaceForIcon: {
      true: {
        paddingLeft: `${16 + IconWidth + IconMargin}px`
      }
    }
  },
}

const StyledItem = styled(Menubar.Item, itemstyles)

const MenubarItem: React.FC<{
  icon?: WidgetIconDesc
  css?: CSS,
} & Menubar.MenubarItemProps> = ({
  icon,
  children,
  ...rest
}) => (
  <StyledItem {...rest} spaceForIcon={icon === EMPTY_ICON} >
    {(icon !== EMPTY_ICON) ? <WidgetIcon icon={icon} /> : null}
    {children}
  </StyledItem>
)

const StyledCheckboxItem = styled(Menubar.CheckboxItem, {
  ...itemstyles,
  position: 'relative',
  display: 'flex', 
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'nowrap',

})

const MenubarItemIndicator = styled(Menubar.ItemIndicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& svg': {
    width: 20,
    height: 20,
  }
})

const MenubarCheckboxItem: React.FC<{
  icon?: WidgetIconDesc
  css?: CSS,
} & Menubar.MenubarCheckboxItemProps> = ({
  icon,
  children,
  ...rest
}) => (
  <StyledCheckboxItem {...rest} spaceForIcon={icon === EMPTY_ICON} >
    <Flex direction='row' justify='start' css={{fontFamily: 'inherit', fontWeight: 'inherit'}}>
      {(icon !== EMPTY_ICON) ? <WidgetIcon icon={icon} /> : null}
      {children}
    </Flex>
    <div>
      <MenubarItemIndicator>
        <CheckIcon />
      </MenubarItemIndicator>
    </div>
  </StyledCheckboxItem>
)

export {
  MenubarItem,
  MenubarCheckboxItem
} 