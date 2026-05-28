import React, { type HTMLProps } from 'react'

import { styled, type CSS, menu, deborder } from '~/style'

import {  
  type WidgetIconDesc,
  WidgetIcon,
  EMPTY_ICON,
  IconMargin,
  IconWidth,
} from '~/primatives'

  // Following this: 
  // https://m3.material.io/components/navigation-drawer/specs

  // https://m3.material.io/styles/typography/type-scale-tokens#d74b73c2-ac5d-43c5-93b3-088a2f67723d
const StyledButton = styled('button', {

  all: 'unset',
  ...menu.sideMenuItem,
  ...deborder('yellow', 'menu'),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxSizing: 'border-size',
  cursor: 'pointer',
  outline: 'none',

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
    backgroundColor: '$menuBGColorHover'
  },
  '&:active': {
    backgroundColor: '$menuBGColorPressed'
  },

  variants: {
    spaceForIcon: {
      true: {
        paddingLeft: `${16 + IconWidth + IconMargin}px`
      }
    },
    disabled: {
      true: {
        color: '$menuTextColorDisabled',
        pointerEvents: 'none'
      }
    }
  }
})

const MenuItem: React.FC<{
  icon?: WidgetIconDesc
  css?: CSS,
} & HTMLProps<HTMLButtonElement>> = ({
  onClick,
  icon,
  css,
  disabled,
  children,
}) => (
    // Was getting very odd typescript issues w ...rest / spread 
  <StyledButton onClick={onClick} disabled={disabled} css={css} spaceForIcon={icon === EMPTY_ICON}>
    {(icon !== EMPTY_ICON) ? <WidgetIcon icon={icon} /> : null}
    {children}
  </StyledButton> 
)

export {
  MenuItem as default,
}
