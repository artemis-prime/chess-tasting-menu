import React from 'react'
import { observer } from 'mobx-react-lite'

import { styled, type CSS, deborder } from '~/style'

import { useChess } from '~/services'
import { Checkbox, Flex, HR } from '~/primatives'

import {
  GameStatusIndicator,
  TurnAndInCheckIndicator,
  MovesTable,
  TransientMessage,
} from '~/app/widgets'

import bg from '~assets/img/slate_bg_low_res.jpg'

const ChalkbdOuter = styled(Flex, {

  backgroundColor: '#444',
  backgroundImage: `url(${bg})`, 
  backgroundSize: 'cover',
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '500px',
  border: '2px $chalkboardBorderColor solid',
  borderRadius: '5px',
  p: '$1_5 $1',
  gap: '$1',

  fontSize: 'inherit',
  lineHeight: 1,

  color: '$chalkboardTextColor',

  '@allMobilePortrait': {
    maxWidth: 'initial',
    transition: '$chalkboardOpenTransition',
    borderTopLeftRadius: '$lgr',
    borderTopRightRadius: '$lgr',
    borderBottomLeftRadius: '$none',
    borderBottomRightRadius: '$none',
    borderBottom: 'none',
    p: '$2 $2',
  },
  '@phonePortrait': {
    fontSize: '1.3em',
  },
  '@tabletPortrait': {
    fontSize: '1.3em',
  },
  '@tabletLargePortrait': {
    fontSize: '1.6em',
  },
  '@phoneLandscape': {
    width: '70%'
  },

  '@deskPortrait': {
    flexGrow: 1,
    maxWidth: 'initial',
    borderTopLeftRadius: '$lgr',
    borderTopRightRadius: '$lgr',
    borderBottomLeftRadius: '$none',
    borderBottomRightRadius: '$none',
    borderBottom: 'none',
    fontSize: '1.1em',
    p: '$2 $3',
  },
  '@menuBreak': {
    p: '$2 $1_5',
    gap: '$1_5',
  },
  '@xl': {
    p: '$2 $2',
  },

    // Only for @deskPortrait, we're varying / animating 
    // the height of ChalkbdOuter (in Layout) 
    // to open / close the chalkboard.
    // In all other situations, we're varying the 
    // chalkboard's actual height within that div.
  variants: {
    showMoves: {
      true: {
        '@phonePortrait': {
          height: '80%',
        },
        '@tabletPortrait': {
          height: '100%',
        },
        '@phoneLandscape': {
          transition: '$chalkboardOpenTransition',
          height: '100%'
        }, 
        '@deskSmallest': {
          height: '100%',
          transition: '$chalkboardOpenTransition'
        } 
      },
      false: {
        '@deskSmallest': {
          height: '15%',
          minHeight: '90px',
          transition: '$chalkboardOpenTransition'
        }, 
        '@allMobilePortrait': {
          height: '15%',
          minHeight: '90px',
          transition: '$chalkboardOpenTransition'
        },
        '@phoneLandscape': {
          transition: '$chalkboardOpenTransition',
          height: '20%',
          minHeight: '40px',
        } 
      }
    }
  }
})

const ChalkbdTopStyled = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  ...deborder('orange', 'chalk'),

  '@deskPortrait': {
    fontSize: '1.2em',
  },
  '@deskSmallest': {
    fontSize: '0.9em',
  },
  '@xl': {
    fontSize: '1.1em',
  },

  '@tabletPortrait': {
    fontSize: '1.2em',
  },
  '@tabletLargePortrait': {
    fontSize: '1.3em',
  }
})

const ChalkbdTop: React.FC<{
  playing: boolean
  showMoves: boolean
  setShowMoves: (b: boolean) => void
}> = ({
  playing,
  showMoves,
  setShowMoves
}) => {

  return (
    <ChalkbdTopStyled >
      {playing ? (
        <TurnAndInCheckIndicator inCheckOnly={showMoves}/> 
      ) : (
        <GameStatusIndicator />
      )}
      <Checkbox checked={showMoves} setChecked={setShowMoves} >show moves</Checkbox>
    </ChalkbdTopStyled>
  )
}

const Chalkboard: React.FC<{
  showMoves: boolean
  setShowMoves: (b: boolean) => void
  css?: CSS
}> = observer(({
  showMoves,
  setShowMoves,
  css
}) => {
  const game = useChess()
    // MovesTable holds state, so has to always be in the tree.
  return (
    <ChalkbdOuter direction='column' align='stretch' css={css} showMoves={showMoves} >
      <ChalkbdTop playing={game.playing} showMoves={showMoves} setShowMoves={setShowMoves}/>
      {showMoves ? (
        <MovesTable css={{mt: showMoves ? 0 : '$1', flexGrow: 1, ...deborder('red', 'layout')}} /> 
      ) : (<>
        <HR css={{'@allMobilePortrait': { display: 'none' }}}/>
        <TransientMessage />
      </>)}
    </ChalkbdOuter>
  )
})

export default Chalkboard
