import React, { type PropsWithChildren, type ReactNode } from 'react'
import { Text, View } from 'react-native'

import { ActionRecord, PIECETYPE_TO_UNICODE } from '@artemis-prime/chess-core'

import { styled } from '~/style'
import { Row } from '~/primatives'

import SideSwatch from '~/app/widgets/SideSwatch'
import NT from '~/app/widgets/movesTable/NotesText'
import EMOJIS from '~/app/widgets/movesTable/emojis'

interface GetMoveNoteFn {
  (action: ActionRecord, prevAction: ActionRecord): ReactNode
}

const Outer: React.FC<PropsWithChildren> = ({
  children
}) => (
  <Row justify='start' align='center'>
    {children}
  </Row>
)

const Emoji = styled(Text, {
  fontSize: '$fontSizeEmoji',
  lineHeight: '$lineHeightChalkboardSmall',
  height:   '$lineHeightChalkboardSmall',
  textAlign: 'center',
  variants: {
    lighter: { true: {
      borderRadius: '$rounded',
      aspectRatio: '1 / 1',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }},
    larger: { true: { 
      fontSize: '$fontSizeEmojiLarger', 
      lineHeight: '$lineHeightChalkboardSmaller',
      height:   '$lineHeightChalkboardSmaller',
    }},
    large: { true: { 
      fontSize: '$fontSizeEmojiLarge', 
      lineHeight: '$lineHeightChalkboardSmaller',
      height:   '$lineHeightChalkboardSmaller',
    }},
    alert: { true: { color: '$alert8' } },  
  },
})

const getMoveNote = (
  rec: ActionRecord, 
  previous: ActionRecord | undefined
): ReactNode => {

  const result: ReactNode[] = [] 
  let check = false
  if (rec.annotatedResult === 'check') {
    check = true
    result.push(
      <Outer key={rec.move.piece.side + 'note-check'}>
        <SideSwatch small side={rec.move.piece.side}/>
        <NT severe>{': '}</NT>
        <Emoji>{EMOJIS.fist}</Emoji>
        <NT severe>!</NT>
      </Outer>
    )
  }
  if (previous?.annotatedResult === 'check') {
    result.push(
      <Outer key={rec.move.piece.side + 'note-prev-check'}>
        <SideSwatch small side={rec.move.piece.side}/>
        <NT>{': phew! '}</NT>
        <Emoji lighter>{EMOJIS.ninja}</Emoji>
      </Outer>
    )
  }
  if (rec.action.includes('capture')) {
      // Even though its technically in response to the pawn
      // capture, 'meh' seems odd after a check!
    if (!(check && rec.captured!.type === 'pawn')) {
      result.push(
        <Outer key={rec.move.piece.side + 'capture'}>
          <SideSwatch small side={rec.captured!.side}/>
          {rec.captured!.type === 'pawn' ? (<>
            <NT>{': '}</NT><Emoji css={{top: -2}} >{EMOJIS.shrug}</Emoji><NT>{' meh'}</NT>
          </>) : (<>
            <NT alert>{': '}</NT><Emoji alert large>{PIECETYPE_TO_UNICODE[rec.captured!.type]}</Emoji><NT alert>{' ouch!'}</NT>
          </>)}
        </Outer>
      )
    }
  }
  if (result.length === 1) {
    return result[0]
  }
  else if (result.length > 1) {
    return result 
  }
  return null
}

export {
  type GetMoveNoteFn,
  getMoveNote as default
}
