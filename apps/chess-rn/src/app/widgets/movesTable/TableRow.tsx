import React, { type PropsWithChildren, type ReactElement, type ReactNode } from 'react'
import { observer } from 'mobx-react-lite'

import { deborder, type CSS } from '~/style'
import { Row, Box } from '~/primatives'
import { type MovePair } from '~/services'

import COLS from './COLS'
import RenderHelper from './RenderHelper'
import TT from './TableText'
import NT from './NotesText'

const Ellipses: React.FC = () => (
  <NT disabled css={{ alignSelf: 'flex-start' }}>...</NT>
)

const Comma: React.FC = () => (
  <NT css={{mr: '$_5'}}>,</NT>
)


const TableRow: React.FC<{
  row: MovePair
  h: RenderHelper
  i: number
}> = observer(({
  row,
  h,
  i
}) => {

  const Notes: React.FC<{ css?: CSS }> = ({ css }) => {
    
    if (h.disableRow(i)) {
      return (row.white.note || row.black?.note) ? <Ellipses key='el-one' /> : null
    }
    let elements: ReactNode[] = []
    if (Array.isArray(row.white.note)) {
      elements = row.white.note as ReactNode[]
    }
    else if (row.white.note) {
      elements.push(row.white.note)
    }
    if (h.disableSide(i, 'black')) {
      elements.push(<Ellipses key='el-two'/>) 
    }
    else if (row.black?.note) {
      if (Array.isArray(row.black.note)) {
        elements = [...elements, ...(row.black.note as ReactNode[])]
      }
      else {
        elements.push(row.black.note)
      }
    }
    const result : ReactNode[] = []
    elements.forEach((n: ReactNode, i) => {
      if (i !== 0) {
        result.push(<Comma key={`comma-${i}`} />)
      }
      result.push(n)
    })

    return (
      <Row justify='start' align='start' css={{...css, flexWrap: 'wrap'}}>
        {result}
      </Row>
    )
  }
 
  return (
    <Row css={{mb: '$_5', ...deborder('yellow', 'moves')}} align='center'>
      <Box css={{
        minWidth: COLS[0], 
        flex: -1, // https://reactnative.dev/docs/layout-props#flex
        ...deborder('white', 'movesRow')
      }} key='one'>
        <TT css={{opacity: 0}}>{h.sizingString()}</TT>
        <TT disabled={h.disableRow(i)} css={{ position: 'absolute', t: 0, l: 0, b: 0, r: 0 }}>
          {`${i + 1})`}
        </TT>
      </Box>
      <Box css={{
        w: COLS[1], 
        flex: 0, 
        ...h.sideHilight(i, 'white'),
        ...deborder('yellow', 'movesRow')
      }} key='two'>
        <TT {...h.sideTextProps(row, i, 'white')} >
          {row.white.str}
        </TT>
      </Box>
      <Box css={{
        w: COLS[2], 
        flex: 0, 
        ...h.sideHilight(i, 'black'), 
        ...h.pulsingOpacity(!row.black),
        ...deborder('white', 'movesRow')
      }} key='three'>
        <TT 
          {...h.sideTextProps(row, i, 'black')} 
          css={h.pulsingFontSize('$fontSizeSmaller', '$fontSizeSmall', !row.black)}
        >
          {row.black?.str ?? '?'}
        </TT>
      </Box>
      <Row justify='start' align='start' css={{
        flex: 1, 
        flexWrap: 'wrap', 
        textAlign: 'right',
        ...deborder('red', 'movesRow')
      }} key='four'>
        <Notes />
      </Row>
    </Row>
  )
})

export default TableRow
