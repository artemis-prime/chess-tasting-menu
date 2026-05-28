import React from 'react'

import { styled, deborder, BREAKPOINTS } from '~/style'
import { BurgerButton } from '~/primatives'
import { Logo, MainMenu, UndoRedoWidget } from '~/app/widgets'

const HeaderOuter = styled('header', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',

  color: '$menuTextColor',
  backgroundColor: '$menuBGColor',
  height: '$headerHeightSmall',
  lineHeight: '$headerHeightSmall',
  fontSize: '$headerFontSizeSmall',
  flex: 'none',

  '@deskSmall': {
    height: '$headerHeightSmaller',
    lineHeight: '$headerHeightSmaller',
  },

  '@menuBreak': {
    height: '$headerHeight',
    lineHeight: '$headerHeight',
    fontSize: '$headerFontSize',
  }
})

const Stage = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  lineHeight: 'inherit',
  fontSize: 'inherit',

  width: '100%',
  ...deborder('white', 'header'),


  '@maxStaging': {
    width: `${BREAKPOINTS.maxStaging}px`,
    m: '0 auto',
  }
})


const Title = styled('h1', {
  m: 0,
  p: 0,
  fontFamily: '$headerFont',
  lineHeight: 'inherit',
  fontSize: 'inherit',
  cursor: 'default',
  userSelect: 'none',

  alignSelf: 'center',
  ...deborder('red', 'header'),

  '@deskSmaller': {
    fontSize: 'inherit',
  },
  '@deskSmall': {
    fontSize: '1.2em',
  },
  '@menuBreak': {
    fontSize: '1.4em',
  },
  '@maxStaging': {
    fontSize: '1.6em',
  },

  '@deskPortrait': {
    fontSize: '1.4em', 
  },

  '@tabletPortrait': {
    fontSize: '1.4em', 
  },
  '@tabletLargePortrait': {
    fontSize: '1.6em', 
  }
}) 

const Left = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start', 
  alignItems: 'center',
  lineHeight: 'inherit',
  fontSize: 'inherit',

  ...deborder('yellow', 'header'),

  '@deskSmaller': {
    width: '85px' // undo / redo chevron version 
  },
  '@tabletLargePortrait': {
    width: '160px'  // undo / redo word version 
  },
  '@menuBreak': {
    width: '160px'  // undo / redo word version 
  },
  '@maxStaging': {
    width: 'initial'   
  }
})

const Right = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end', 
  alignItems: 'center',
  lineHeight: 'inherit',
  fontSize: 'inherit',
  ...deborder('yellow', 'header'),

  '@maxStaging': {
    width: '280px' // roughly Logo + MainMenu
  }
})

const Header: React.FC<{
  menuOpen: boolean
  toggleMenu: () => void
}> = ({
  menuOpen,
  toggleMenu
}) => (
  <HeaderOuter>
    <Stage>
      <Left>
        <BurgerButton toggledOn={menuOpen} onClick={toggleMenu} css={{
          alignSelf: 'stretch', 
          width: 'initial', 
          lineHeight: '80%', 
          aspectRatio: 1, 
          '@maxStaging': {display: 'none'},
        }}/>
        <Logo css={{mr: '$1', display: 'none', '@maxStaging': {display: 'flex'} }}/>
        <MainMenu css={{display: 'none', '@maxStaging': {display: 'flex'} }}/>
      </Left>
      <Title>Chess Two Ways - Web</Title>
      <Right>
        <UndoRedoWidget css={{alignSelf: 'stretch', fontSize: 'inherit'}}/>
      </Right>
    </Stage>
  </HeaderOuter>
)

export default Header
