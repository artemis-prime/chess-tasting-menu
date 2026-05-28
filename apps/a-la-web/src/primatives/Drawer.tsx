import React, { type PropsWithChildren } from 'react'

import { styled, type CSS } from '~/style'

const InnerDrawer = styled('div', {

  outline: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  position: 'absolute',
  bottom: 0,
  top: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',

  '$$drawerWidth': '80%',
  width: '$$drawerWidth',

  variants: {
    side: {
      left: { 
        transition: '$drawerLeftOpenTransition', 
      },
      right: { 
        transition: '$drawerRightOpenTransition', 
      }
    },
    open: {
      true: {},
      false: {}
    },
  },
  compoundVariants: [
    {
      side: 'left',
      open: true,
      css: { left: '0px', }
    },
    {
      side: 'left',
      open: false,
      css: { left: '-$$drawerWidth'}
    },
    {
      side: 'right',
      open: true,
      css: { right: '0px' }
    },
    {
      side: 'right',
      open: false,
      css: { right: '-$$drawerWidth' }
    },
  ]

})

// $$drawerWidth ('Foopx' or 'Foo%') can be passed in
// via css to alter the size 
const Drawer: React.FC<{
  side: 'left' | 'right',
  open: boolean,
  css?: CSS
} & PropsWithChildren
> = ({
  side,
  open,
  children,
  css
}) => {

  return (
    <InnerDrawer side={side} open={open} css={{...css}}>
      {children}
    </InnerDrawer>
  )
}

export default Drawer
