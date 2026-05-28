import React from 'react'

import { styled, type CSS } from '~/style'

const StyledButton = styled('button', {

  border: 'none',
  flex: 'none',

  backgroundColor: 'transparent',
  cursor: 'pointer',
  width: '$headerHeight',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  color: 'inherit',
  borderRadius: '$rounded',

    // https://stackoverflow.com/questions/16056591/font-scaling-based-on-size-of-container#comment29460412_19814948
  containerType: 'size',

  '&:hover': {
    backgroundColor: '$menuHover'
  },
  '&:active': {
    backgroundColor: '$menuPressed'
  },

  variants: {
    toggledOn: {
      true: {
        backgroundColor: '$menuHover',
        '&:hover': {
          backgroundColor: '$menuSelectedHover'
        },
          // This has to be specified since 
          // this generates a more specific css selector
        '&:active': {
          backgroundColor: '$menuPressed'
        },
      }
    }
  }
})

const StyledSpan = styled('span', {
  fontSize: '50cqh', 
  fontWeight: 700, 
  top: '1px', 
  left: '-1px', 
  display: 'block', 
  position: 'relative' 
})

const BurgerButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>
  toggledOn: boolean,
  css?: CSS
}> = ({
  onClick,
  toggledOn,
  css
}) => (
  <StyledButton onClick={onClick} toggledOn={toggledOn} css={css}>
    <StyledSpan>{'\u2630'}</StyledSpan>
  </StyledButton>
)

export default BurgerButton
