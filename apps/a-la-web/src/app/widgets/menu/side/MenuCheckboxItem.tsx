import React from 'react'

import { CheckIcon } from '@radix-ui/react-icons'

import { styled, type CSS, menu, deborder } from '~/style'
import { Flex } from '~/primatives'

import {  
  type WidgetIconDesc,
  WidgetIcon,
  EMPTY_ICON,
  IconMargin,
  IconWidth,
} from '~/primatives'

const StyledLabel = styled('label', {
    
  all: 'unset',
  ...menu.sideMenuItem,
  ...deborder('white', 'menu'),
  cursor: 'pointer',
  display: 'flex', 
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'nowrap',
  pr: `${24 - IconMargin}px`,

  height: '$headerHeightSmall',
  lineHeight: '$headerHeightSmall',
  fontSize: '$headerFontSizeSmall',

  '@deskSmall': {
    height: '$headerHeightSmaller',
    lineHeight: '$headerHeightSmaller',
  },

  '@menuBreak': {
    height: '$headerHeight',
    lineHeight: '$headerHeight',
    fontSize: '$headerFontSize',
  },

  '&:hover': {
    backgroundColor: '$menuHover'
  },
  '&:active': {
    backgroundColor: '$menuPressed'
  },

  variants: {
    spaceForIcon: {
      true: {
        paddingLeft: `${16 + IconWidth + IconMargin}px`
      }
    },
    disabled: {
      true: {
        color: '$menuDisabled',
        pointerEvents: 'none'
      }
    }
  }
})

const CheckboxOuter = styled('div', {

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 20,
    height: 20,
  }
})

const MenuCheckboxItem: React.FC<{
  checked: boolean
  setChecked: (b: boolean) => void
  icon?: WidgetIconDesc
  css?: CSS
} & React.HTMLProps<HTMLInputElement>> = ({
  checked,
  setChecked, 
  icon,
  css,
  children
}) => {

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked)
  }

  return (
    <StyledLabel css={css} spaceForIcon={icon === EMPTY_ICON}>
      <input type='checkbox' checked={checked} onChange={onChange} hidden/>
      <Flex direction='row' justify='start' css={{fontFamily: 'inherit', fontWeight: 'inherit'}}>
        {(icon !== EMPTY_ICON) ? <WidgetIcon icon={icon} /> : null}
        {children}
      </Flex>
      <CheckboxOuter>
        {checked && <CheckIcon /> }
      </CheckboxOuter>
    </StyledLabel>
  )
}

export default MenuCheckboxItem
