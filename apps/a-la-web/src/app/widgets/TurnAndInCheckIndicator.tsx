import React, {useState, useEffect } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { positionToString } from '@artemis-prime/chess-core'

import { styled, type CSS } from '~/style'
import { useChess, usePulses } from '~/services'
import { Box } from '~/primatives'

import SideSwatch from './SideSwatch'

const Text = styled('span', {
  color: '$chalkboardTextColor',
  variants: {
    inCheck: { true: {} },
    pulse: { true: {} },
  },
  compoundVariants: [
    {
      inCheck: true,
      pulse: true,
      css: {
        color: '$alert8'
      }
    },
    {
      inCheck: true,
      pulse: false,
      css: {
        color: '$alert9'
      }
    }
  ]
}) 

const TurnAndInCheckIndicator: React.FC<{
  inCheckOnly?: boolean
  css?: CSS
}> = observer(({
  inCheckOnly = false,
  css
}) => {

  const game = useChess()
  const pulses = usePulses()
  const [inCheckFrom, setInCheckFrom] = useState<string>('')

    // Returning autorun's disposer as per mobx docs
  useEffect(() => (autorun(() => {
    let str = ''
    if (game.check) {
      str = game.check.from.reduce((acc, current, i) => (
        ((i > 0) ? ', ' : '') + acc + positionToString(current)
      ), '')
    }
    setInCheckFrom(str)
  })), [])

    // Using 'visibility' (vs 'display') holds space in the layout, which reduces jumping around.
  return (
    <Box css={{...css, 
      visibility:  (inCheckOnly ? (inCheckFrom.length > 0 ? 'visible' : 'hidden') : 'visible')
    }}>
      <SideSwatch side={game.currentTurn} css={{ 
        w: (inCheckFrom.length > 0) ? '1em' : '3em', 
        '@deskPortrait': {fontSize: '1.3em'}
      }}/>
      <Text pulse={pulses.slow} inCheck={inCheckFrom.length > 0}>{(inCheckFrom.length > 0) ? `'s in check from ${inCheckFrom}!` : 's turn'}</Text>
    </Box> 
  )
})

export default TurnAndInCheckIndicator
