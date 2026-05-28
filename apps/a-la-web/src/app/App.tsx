import React, { useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { 
  styled, 
  deborder, 
  sideArea, 
  applySideWidthsToStyles, 
  useQueryCallback 
} from '~/style'

import { SideMenu } from '~/app/widgets'

import Chalkboard from './Chalkboard'
import Header from './Header'
import Chessboard from './Chessboard'

import '~/style/fonts.scss'
import '~/style/body.scss'

const Outer = styled('div', {
  ...deborder('orange', 'layout'),
  boxSizing: 'border-box',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

const Main = styled('main', {
  ...deborder('red', 'layout'),
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  width: '100%',
  flexGrow: '1',
  fontSize: '0.75rem',
  p: '$_5',
  gap: '$_5',

  '@allMobilePortrait': {
    flexDirection: 'column',
    justifyContent: 'space-between',
    pb: 0,
  },
  '@phonePortrait': {
    pt: '$2',
    gap: '$1',
  },
  '@tabletPortrait': {
    pt: '$1',
  },

  '@allMobileLandscape': {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },

  '@deskPortrait': {
    flexDirection: 'column',
    p: '$1',
    pb: 0,
    gap: '$1',
  },
  '@deskSmaller': {
    fontSize: '0.8rem',
  },
  '@deskSmall': {
    fontSize: '0.9rem',
  },
  '@menuBreak': {
    fontSize: '1rem',
    p: '$1',
    gap: '$1',
  },
})

const SymmetryDiv = styled('div', {
  ...deborder('green', 'layout'),
  display: 'none',

  '@maxStaging': {
    display: 'block',
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: sideArea.maxStaging,
  },
  '@xl': {
    flexBasis: sideArea.xl,
  },
  '@xxl': {
    flexBasis: sideArea.xxl,
  }
})

    // Only for @deskPortrait, we're varying / animating 
    // the height of ChalkbdOuter (in Layout) 
    // to open / close the chalkboard.
    // In all other situations, we're varying the 
    // chalkboard's actual height within that div.
const ChalkbdOuter = styled('div', 
  applySideWidthsToStyles(
    {
      ...deborder('blue', 'layout'),
      flexShrink: 0,
      flexGrow: 0,

      '@allMobilePortrait': {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
      '@allMobileLandscape': {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      '@deskPortrait': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: 'min(260px, 30%)',
        transition: '$chalkboardOpenTransition',
        flex: 'none',
      },
      '@maxStaging': {
        flexGrow: 1,
        flexShrink: 0,
      },
    },
    'flexBasis',
    (value: any): string => ((typeof value === 'number') ? `${value}px` : value as string)
  ),
    // Variants should be separated if wrapping a style object, 
    // since otherwise typescript doesn't see the variant types as props.
  {
    variants: {
      showMoves: {
        false: { '@deskPortrait': { height: '70px' } }
      }
    }
  }
)

const ChessboardOuter = styled('div', 
  applySideWidthsToStyles(
    {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      ...deborder('yellow', 'layout'),

      '@allMobilePortrait': {
        px: 0,
        flexGrow: 0,
      },
      '@allMobileLandscape': {
        flex: 'none',
        aspectRatio: '1 / 1',
      },
      '@deskPortrait': {
        px: 0,
        flexGrow: 1,
        flexShrink: 1,
      },
      '@deskSmallest': {
        flexShrink: 1,
        flexGrow: 0,
        justifyContent: 'flex-end',
      },
      '@maxStaging': {
        justifyContent: 'center',
      },
    },
    'width',
    (value: any): string => (`calc(100% - ${((typeof value === 'number') ? `${value * 2}px` : value as string)})`),
    true
  )
)

const ChessboardArea: React.FC = () => {

  const [tall, setTall] = useState<boolean>(false)
  const { ref } = useResizeDetector({
    onResize: (width, height) => {
      if (!width || !height) return ;
      const current = (height > width)
      if (current != tall) {
        setTall(current)  
      } 
    } 
  })

  return (
    <ChessboardOuter ref={ref} >
      <Chessboard tall={tall} />
    </ChessboardOuter>
  )
}

const App: React.FC = () => {
  
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean >(false) 
  const [showMoves, setShowMoves] = useState<boolean>(false)

  useQueryCallback('maxStaging', () => {setSideMenuOpen(false)})
  const toggleMenu = () => { setSideMenuOpen((prev) => (!prev)) }
  
  return (
    <Outer>
      <Header menuOpen={sideMenuOpen} toggleMenu={toggleMenu} />
      <Main>
        <SymmetryDiv />
        <ChessboardArea />
        <ChalkbdOuter showMoves={showMoves}>
          <Chalkboard showMoves={showMoves} setShowMoves={setShowMoves} />
        </ChalkbdOuter>
        <SideMenu open={sideMenuOpen} css={{ 
          '@maxStaging': { display: 'none'},
            // Setting '$$drawerWidth' this way is part of 
            // Drawer's API. 
          '$$drawerWidth': '85%', 
          '@allMobileLandscape': { '$$drawerWidth': '280px' },
          '@deskPortrait': { '$$drawerWidth': '280px' },
          '@tabletPortrait': { '$$drawerWidth': '280px' },
          '@deskSmaller': { '$$drawerWidth': '280px' }
        }} />
      </Main>
    </Outer>
  )
}

export default App
