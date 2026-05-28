import React from 'react'
import { observer } from 'mobx-react-lite'

import { type CSS, useTheme } from '~/style'
import { useChess } from '~/services'
import { GhostButton, Row } from '~/primatives'

const UndoRedoWidget: React.FC<{
  menu?: boolean 
  chalkboard?: boolean 
  css?: CSS
}> = observer(({
  menu, 
  chalkboard, 
  css
}) => {
  const game = useChess()
  const theme = useTheme()
  const commonStyle = {
    paddingLeft: theme.space[2],
    paddingRight: theme.space[2]
  }
  return (
    <Row justify='end' align='stretch' css={css} >
      <GhostButton 
        menu={menu}
        chalkboard={chalkboard}
        disabled={!game.canUndo}
        onClick={game.undo}
        containerStyle={commonStyle}
        textCss={{fontSize: 40, t: 1}}
      >{'\u2039'}</GhostButton>
      <GhostButton 
        menu={menu}
        chalkboard={chalkboard}
        disabled={!game.canRedo}
        onClick={game.redo}
        containerStyle={commonStyle}
        textCss={{fontSize: 40, t: 1}}
      >{'\u203A'}</GhostButton>
    </Row>
  )
})

export default UndoRedoWidget
