import React from 'react'

import { styled, type CSS } from '~/style'

const StyledBGDiv = styled('div', {
  w: '40px',
  h: '40px',
  borderRadius: '$rounded',
  backgroundColor: '$pieceColorWhite',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  border: '2px solid $pieceColorBlack',

  '& svg': {
    fill: '$pieceColorBlack'
  }
})

const Knight: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 -50 700 700" xmlns="http://www.w3.org/2000/svg" >
    <path 
      d="m454.16 449.12h-22.961c52.078-22.398 43.68-71.121 24.078-120.96-19.602-48.719 35.84-84.559 40.879-173.04 7.2852-131.04-116.48-141.12-150.08-141.12-4.4805 0-7.2812 3.9219-6.1602 8.3984l10.078 38.078s-38.078 2.2383-57.68 42.559c-19.602 40.879-76.16 57.121-85.68 82.32s11.199 59.922 25.199 63.84c20.719 6.1602 76.16-31.359 91.281-38.078 15.121-6.1602 18.48 7.8398-58.801 105.84-67.199 85.121-14.559 123.76 0 132.16h-18.48c-31.359 0-57.121 25.762-57.121 57.121v30.238c0 5.0391 4.4805 9.5195 9.5195 9.5195h302.96c5.0391 0 9.5195-4.4805 9.5195-9.5195v-30.238c0.56641-31.359-25.195-57.117-56.555-57.117z"
    />
  </svg>
)

const Logo: React.FC<{
  css?: CSS
}> = ({
  css
}) => (
  <StyledBGDiv css={css}>
    <Knight size={36} />
  </StyledBGDiv>
)

export default Logo
