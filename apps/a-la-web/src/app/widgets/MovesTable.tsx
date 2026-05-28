import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { computedFn } from 'mobx-utils'

import ScrollableFeed from 'react-scrollable-feed' 

import { type Side } from '@artemis-prime/chess-core'

import { styled, type CSS, deborder } from '~/style'
import { 
  type MovePair,  
  useChess, 
  useMovePairs, 
  usePulses 
} from '~/services'
import { Row, Box, HR } from '~/primatives'

import SideSwatch from './SideSwatch'
import TransientMessage from './TransientMessage'
import moveNoteFn from './movesTable/getMoveNote'

  // TS workaround for put in module
const Scrollable = ScrollableFeed as any
const COL_WIDTHS = ['1.1em', '6em', '6em', 'auto']

const StyledSpan = styled('span', {})

const Ellipses: React.FC = () => (
  <StyledSpan css={{color: '$chalkboardTextColorDisabled', fontSize: '1.6em', lineHeight: '1em', alignSelf: 'flex-start'}}>...</StyledSpan>
)

const Comma: React.FC = () => (
  <StyledSpan css={{fontSize: 'inherit', mr: '0.3em'}}>,</StyledSpan>
)

const Outer = styled('div', {
  ...deborder('yellow', 'chalk'),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
})

const ScrollableOuter = styled('div', {
  flex: '1 0 auto', 
  position: 'relative', 
  ...deborder('red', 'chalk')
})


const StyledScrollable = styled(Scrollable, {

  position: 'absolute', 
  top: 0, 
  bottom: 0, 
  left: 0, 
  right: 0,
  mt: '$1',
  overflowX: 'hidden',

  '&::-webkit-scrollbar': {
    width: '10px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#444',
    border: '1px solid #777',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    backgroundColor: '#777',
    '&:hover': {
      backgroundColor: '#aaa'
    }
  }
})

const MovesTable: React.FC<{
  css?: CSS
}> = observer(({
  css
}) => {

  const movePairs = useMovePairs(moveNoteFn)
  const game = useChess()
  const pulses = usePulses()

  const sideHilight = computedFn((moveRow: number, side: Side): any => {
    if (movePairs.hilightedMoveRow !== null) {
      if (movePairs.hilightedMoveRow === moveRow && movePairs.hilightedSide === side) {
        return {
          p: '0.15em',
          border: '0.1em dashed $alert8',
          borderRadius: '3px'
        }
      }
    }
    return {p: '0.25em'}
  })

  const sideColor = computedFn((moveRow: number, side: Side): CSS => {

    if (disableSide(moveRow, side)) {
      return { color: '$chalkboardTextColorDisabled'}
    }
    const half = movePairs.rows[moveRow][side]
    return {color:  half ? ((half.rec.annotatedResult || half.rec.action.includes('capture')) ? '$alert8' : '$chalkboardTextColor')  : '$chalkboardTextColor'}
  })

  const disableSide = computedFn((moveRow: number, side: Side): boolean => {

    if (movePairs.hilightedMoveRow !== null) {
      if (moveRow > movePairs.hilightedMoveRow) {
        return true
      }
      else if (moveRow === movePairs.hilightedMoveRow) {
        if (side === 'black' && movePairs.hilightedSide === 'white') {
          return true 
        }
      }
    }
    return false
  })

  const disableRow = computedFn((moveRow: number): boolean => {
    if (movePairs.hilightedMoveRow !== null) {
      if (moveRow > movePairs.hilightedMoveRow) {
        return true
      }
    }
    return false
  })

  const pulsingOpacity = computedFn((enabled: boolean): CSS => (
    (enabled) ? { opacity: pulses.slow ? .8 : .7} : {}
  )) 

  const swatchCss = computedFn((side: Side): CSS =>  ({
    width: '100%', 
    borderColor: (game.currentTurn === side && pulses.slow) ? ((side === 'white') ? '#ddd' : '#888') : '#777', 
    opacity: (game.currentTurn === side) ? 1 : ((side === 'white') ? 0.7 : 0.5)
  })) 

  const r = movePairs

  return (
    <Outer css={css}>
      <Row css={{w: '100%', mb: '$_5', flex: 'none'}} key='title-row'>
        <Box css={{w: COL_WIDTHS[0], mr: '$_5'}}>&nbsp;</Box>
        <Box css={{w: COL_WIDTHS[1], pr: '$1_5'}}><SideSwatch narrow side='white' css={swatchCss('white')}/></Box>
        <Box css={{w: COL_WIDTHS[2], pr: '$1_5'}}><SideSwatch narrow side='black' css={swatchCss('black')}/></Box>
        <Row justify='center' css={{w: COL_WIDTHS[3]}}>notes:</Row>
      </Row>
      <HR css={{flex: 'none'}}/>
      <ScrollableOuter>
        <StyledScrollable>
        {r.rows.map((row: MovePair, i) => (
          <Row css={{w: '100%', mb: '$_5'}} key={row.white.str + (row.black?.str ?? '')} align='center'>
            <Box 
              css={{
                minWidth: COL_WIDTHS[0], 
                flex: 'none', 
                color: disableRow(i) ? '$chalkboardTextColorDisabled' : '$chalkboardTextColor' 
              }}
            >{`${i + 1})`}</Box>
            <Box 
              css={{
                w: COL_WIDTHS[1], 
                flex: 'none', 
                ...sideColor(i, 'white'), 
                ...sideHilight(i, 'white')
              }}
            >{row.white.str}</Box>
            <Box 
              css={{
                w: COL_WIDTHS[2], 
                flex: 'none', 
                ...sideColor(i, 'black'), 
                ...sideHilight(i, 'black'), 
                ...pulsingOpacity(!row.black)
              }}
            >{row.black?.str ?? '?'}</Box>
            <Row 
              justify='start' 
              align='start' 
              css={{
                w: COL_WIDTHS[3], 
                flexGrow: 3, 
                flexWrap: 'wrap', 
                whiteSpace: 'nowrap', 
                fontSize: '0.9em',
                lineHeight: '1em',
                textAlign: 'right',
              }}
            >
              {disableRow(i) ? (
                (row.white.note || row.black?.note) ? <Ellipses /> : ''
              ) : (<>
                { row.white.note }
                {(row.white.note && row.black?.note) && <Comma />}
                { row.black?.note ? ((disableSide(i, 'black')) ? <Ellipses /> : row.black!.note) : '' } 
              </>)}
            </Row>
          </Row>
        ))}
        
        { // If the previous row was complete, create a fake last row for the pulsing '?' in white's column.
        !disableRow(r.rows.length /* safe */) && r.rows.length > 0 && r.rows[r.rows.length - 1].black != null && (
          <Row css={{w: '100%', mb: '$_5'}} key='last'>
            <Box css={{minWidth: COL_WIDTHS[0], flex: 'none', mr: '$_5', color:'$chalkboardTextColor' }}>{`${r.rows.length + 1})`}</Box>
            <Box css={{w: COL_WIDTHS[1], flex: '5 0 auto', color: '$chalkboardTextColor', ...pulsingOpacity(true)}}>?</Box>
          </Row>
        )}
        <TransientMessage />
        </StyledScrollable>
      </ScrollableOuter>
    </Outer>
  )
})

export default MovesTable
