import React, { type  CSSProperties } from 'react'

import { styled, menu, deborder } from '~/style'

import type WidgetIconDesc from './WidgetIconDesc'

const IconWidth = 24
const IconMargin = 11 // fudging a bit from MD3 spec

const UnicodeWrapper = styled('span', {

  fontFamily: menu.sideMenuItem.fontFamily,
  whiteSpace: 'nowrap',
  ...deborder('yellow', 'menu'),
  fontSize: IconWidth,
  fontWeight: '$bold',
  
  width: `${IconWidth}px`,
  textAlign: 'center',
  mr: `${IconMargin}px`,
})

const WidgetIcon: React.FC<{
  icon: WidgetIconDesc | undefined
}> = ({
  icon,
}) => {
  if (icon === undefined) {
    return null
  }
  let unicode = (typeof icon === 'string') ? icon as string : icon.icon 
  let style = (typeof icon === 'string') ? {} : icon.style 

  return (
    <UnicodeWrapper style={style as CSSProperties }>{unicode}</UnicodeWrapper>
  )
}

export {
  WidgetIcon as default,
  IconMargin,
  IconWidth,
}
