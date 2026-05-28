import React, {useState, useEffect } from 'react'
import { Text } from 'react-native'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'

import { positionToString } from '@artemis-prime/chess-core'

import { styled, type CSS, typography, deborder } from '~/style'
import { useChess, usePulses } from '~/services'
import { Row } from '~/primatives'

import SideSwatch from './SideSwatch'

const CheckText = styled(Text, {
  ...typography.chalkboard.normal,
  ...deborder('green', 'chalkboard'),
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

  return (
    <Row 
      align='stretch' 
      css={{
        ...css, 
        ...deborder('white', 'chalkboard'), 
        visible: (inCheckOnly ? (inCheckFrom ? true : false) : true)
      }}
    >
      <SideSwatch 
        side={game.currentTurn} 
        css={{ 
          ...deborder('red', 'chalkboard'), 
          w: (inCheckFrom ? '$space$3' : '$space$6') 
        }}
      />
      <CheckText pulse={pulses.slow} inCheck={!!inCheckFrom}>
        {inCheckFrom ? `'s in check from ${inCheckFrom}!` : 's turn'}
      </CheckText>
    </Row> 
  )
})

export default TurnAndInCheckIndicator
