import React from 'react'
import { observer } from 'mobx-react-lite'

import { useChess } from '~/services'
import { Row, Column, ChalkText } from '~/primatives'

import SideSwatch from './SideSwatch'

const GameStatusIndicator: React.FC = observer(() => {

  const game = useChess()

  return game.gameStatus.victor ? (
    <Column css={{ mb: '$1'}}>
      {game.gameStatus.victor === 'none' ? (<>
        <ChalkText css={{mb: '$_5'}}>
          It's a draw!
          <ChalkText size='smaller' css={{pl: '$1'}}>{game.gameStatus.state === 'stalemate' ? ' (stalemate)' : ' (agreement)'}</ChalkText>
        </ChalkText> 
        <Row align='center'>
          <SideSwatch small side='white' />
          <ChalkText size='larger' css={{px: '$1_5'}}>=</ChalkText>
          <SideSwatch small side='black' />
          {game.gameStatus.state === 'stalemate' && <ChalkText css={{px: '$1_5'}}>, $</ChalkText>}
        </Row> 
      </>) : (<>
        <Row align='center'>
          <SideSwatch small side={game.gameStatus.victor}/>
          <ChalkText css={{ml: '$1'}}>won!</ChalkText>
          <ChalkText size='smaller' css={{pl: '$1'}}>{game.gameStatus.state === 'checkmate' ? '(checkmate)' : '(concession)'}</ChalkText>
        </Row>
        <ChalkText size='smaller'>{game.gameStatus.victor === 'white' ? '1-0' : '0-1'}{game.gameStatus.state === 'checkmate' ? ', #' : ', con.'}</ChalkText> 
      </>)}
    </Column>
  ) : null
})

export default GameStatusIndicator
