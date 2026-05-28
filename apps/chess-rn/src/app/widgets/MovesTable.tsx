import React, { useRef } from 'react'
import { FlatList, View } from 'react-native'
import { observer } from 'mobx-react-lite'
import { computedFn } from 'mobx-utils'

import { type Side } from '@artemis-prime/chess-core'

import { styled, type CSS, deborder as deb } from '~/style'
import { Row, Box, HR, } from '~/primatives'
import { 
  useChess, 
  useMovePairs, 
  usePulses, 
  type MovePair  
} from '~/services'

import SideSwatch from './SideSwatch'
import RenderHelper from './movesTable/RenderHelper'
import TableRow from './movesTable/TableRow'
import COLS from './movesTable/COLS'
import TT from './movesTable/TableText'
import moveNoteFn from './movesTable/GetMoveNote'

const Outer = styled(View, {
  ...deb('yellow', 'moves'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
})

const MovesTable: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const movePairs = useMovePairs(moveNoteFn)
  const pulses = usePulses()
  const game = useChess()
  const helperRef = useRef<RenderHelper>(new RenderHelper(movePairs, pulses))

  const swatchCss = computedFn((side: Side): CSS => ({
    width: '100%', 
    borderColor: (game.currentTurn === side && pulses.slow) ? ((side === 'white') ? '#ddd' : '#aaa') : '#777', 
    opacity: (game.currentTurn === side) ? 1 : ((side === 'white') ? 0.7 : 0.5)
  })) 

  const HeaderRow: React.FC = observer(() => (
    <Row align='end' css={{w: '100%', mb: '$_5', flex: 0}} key='title-row'>
      <Box css={{ mr: '$_5', ...deb('yellow', 'movesH')}} key='one'><TT css={{opacity: 0}}>{helperRef.current.sizingString()}</TT></Box>
      <Box css={{w: COLS[1], pr: '$1_5', ...deb('orange', 'movesH')}} key='two'>
        <SideSwatch narrow side='white' css={swatchCss('white')}/>
      </Box>
      <Box css={{w: COLS[2], pr: '$1_5', ...deb('yellow', 'movesH')}} key='three'>
        <SideSwatch narrow side='black' css={swatchCss('black')}/>
      </Box>
      <Row justify='start' align='end' css={{flexGrow: 1, pl: '$1', ...deb('orange', 'movesH')}} key='four'>
        <TT css={{ top: 2, ...deb('white', 'movesH')}}>notes:</TT>
      </Row>
    </Row>
  ))

  const Footer: React.FC = observer(() => (
    // If the previous row was complete, create a fake last row for the pulsing '?' in white's column.
    (!helperRef.current.disableRow(movePairs.rows.length /* safe */) 
      && movePairs.rows.length > 0 
      && movePairs.rows[movePairs.rows.length - 1].black != null
    ) ? (
      <Row css={{w: '100%', mb: '$_5', ...deb('white', 'moves')}} key='last'>
        <Box css={{minWidth: COLS[0], flex: -1, mr: '$_5', color:'$chalkboardTextColor', ...deb('red', 'moves')}} key='one'>
          <TT css={{opacity: 0}}>{helperRef.current.sizingString()}</TT>
          <TT css={{position: 'absolute', t: 0, l: 0, b: 0, r: 0}}>
            {`${movePairs.rows.length + 1})`}
          </TT>
        </Box>
        <Box css={{w: COLS[1], flex: '5 0 auto', color: '$chalkboardTextColor', ...helperRef.current.pulsingOpacity(true)}} key='two'>
          <TT css={helperRef.current.pulsingFontSize('$fontSizeSmaller', '$fontSizeSmall', true)}>?</TT>
        </Box>
      </Row>
    ) 
    : 
    null
  )) 

  return (
    <Outer css={{...css, ...deb('green', 'movesLayout')}}>
      <HeaderRow />
      <HR css={{flex: 0, mt: 0}}/>
      <Box css={{flexGrow: 1, ...deb('blue', 'movesLayout')}} > 
        <FlatList<MovePair> 
          renderItem={({item, index}) => (<TableRow row={item} i={index} h={helperRef.current} />)}
          data={movePairs.rows.slice()}
          keyExtractor={(row) => (row.white.str + (row.black?.str ?? ''))}
          ListFooterComponent={Footer}
          style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, ...deb('yellow', 'movesLayout')}}
        />
      </Box>
    </Outer>
  )
})

export default MovesTable
