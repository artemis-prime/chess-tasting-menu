import type { ReactNode } from 'react'

import { ActionRecord, PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'

import { styled } from '~/style'

import SideSwatch from '../SideSwatch'
import EMOJIS from './emojis'

interface GetMoveNoteFn {
  (action: ActionRecord, prevAction: ActionRecord): ReactNode
}

const Outer = styled('span', {})

const Emoji = styled('span', {
  fontSize: 'inherit',
  variants: {
    lighter: {
      true: {
        borderRadius: '$rounded',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }
    },
    larger: {
      true: {
        fontSize: '1em',
      }
    },
    large: {
      true: {
        fontSize: '1.2em',
      }
    }
  }
})

const Text = styled('span', {
  fontSize: 'inherit',
  color: 'inherit'
})

const getMoveComment = (rec: ActionRecord, previous: ActionRecord | undefined): ReactNode => {

  const result: ReactNode[] = [] 
  let check = false
  if (rec.annotatedResult === 'check') {
    check = true
    result.push(
      <Outer css={{color: '$alert9'}} key={rec.move.piece.side + 'one'}>
        <SideSwatch small side={rec.move.piece.side}/>
        <Text>:&nbsp;</Text>
        <Emoji>{EMOJIS.fist}</Emoji>
        <Text>!</Text>
      </Outer>
    )
  }
  if (previous?.annotatedResult === 'check') {
    result.push(
      <Outer key={rec.move.piece.side + 'two'}>
        <SideSwatch small side={rec.move.piece.side}/>
        <Text>{': phew! '}</Text>
        <Emoji larger lighter>{EMOJIS.ninja}</Emoji>
      </Outer>
    )
  }
  if (rec.action.includes('capture')) {
      // Even though its technically in response to the pawn
      // capture, 'meh' seems odd after a check!
    if (!(check && rec.captured!.type === 'pawn')) {
      result.push(
        <Outer css={{color: rec.captured!.type === 'pawn' ? 'white' : '$alert8'}} key={rec.move.piece.side + 'three'}>
          <SideSwatch small side={rec.captured!.side}/>
          {rec.captured!.type === 'pawn' ? (<>
            <Text>{': '}</Text>
            <Emoji larger>{EMOJIS.shrug}</Emoji>
            <Text>{' meh'}</Text>
          </>) : (<>
            <Text>{': '}</Text>
            <Emoji large>{PIECETYPE_TO_UNICODE[rec.captured!.type]}</Emoji>
            <Text>{' ouch!'}</Text>
          </>)}
        </Outer>
      )
    }
  }
  if (result.length === 1) {
    return result[0]
  }
  else if (result.length > 1) {
    return <>{result.map((el, i) => (
      (i === 0) ? el : <><Text>{', '}</Text>{el}</> 
    ))}</>
  }
  return null
}

export {
  getMoveComment as default, 
  type GetMoveNoteFn 
}