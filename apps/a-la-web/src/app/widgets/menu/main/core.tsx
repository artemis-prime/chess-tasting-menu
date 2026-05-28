import type { PropsWithChildren } from 'react'
import * as Menubar from '@radix-ui/react-menubar'

import { styled, menu } from '~/style'

const MenubarRoot = styled(Menubar.Root, {
  display: 'flex',
  direction: 'row',
  height: '$headerHeight',
})

const MenubarMenu = styled(Menubar.Menu, {})

const MenubarTrigger = styled(Menubar.Trigger, {
  all: 'unset',
  ...menu.menuBarTrigger,

  outline: 'none',
  userSelect: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '&[data-state="open"]': {
    backgroundColor: '$menuBGColorHover',
    '&:hover': {
      backgroundColor: '$menuBGColorSelectedHover',
    }
  },
  '&:hover': {
    backgroundColor: '$menuBGColorHover',
  }

})

const MenubarContent = styled(Menubar.Content, {
  minWidth: 220,
  backgroundColor: '$menuBGColor',
  borderRadius: '$popupMenu',
  boxShadow: '0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
})

const MenubarPopup: React.FC<PropsWithChildren> = ({ 
  children 
}) => (
  <Menubar.Portal>
    <MenubarContent align="start" sideOffset={5} alignOffset={-1}>
      {children}
    </MenubarContent>
  </Menubar.Portal>
)


const RightSlot = styled('div', {

  fontSize: menu.menuBarPopupItem.fontSize,
  fontFamily: menu.menuBarPopupItem.fontFamily,
  fontWeight: menu.menuBarPopupItem.fontWeight,
  marginLeft: 'auto',
  paddingLeft: 20,
  color: '$menuRightSymbol',
  '[data-highlighted] > &': { color: '$menuTextColor' },
  '[data-disabled] &': { color: '$menuTextColorDisabled' },
})

const MenubarSeparator = styled(Menubar.Separator, {
  height: '0.5px',
  backgroundColor: '$menuTextColorDisabled',
  mx: '6px',
  my: '2px',
})

export {
  MenubarRoot,
  MenubarMenu,
  MenubarTrigger, 
  MenubarPopup,
  RightSlot,
  MenubarSeparator,
}