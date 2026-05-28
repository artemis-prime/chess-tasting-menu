import React from 'react'
import { observer } from 'mobx-react-lite'

import { useChess } from '~/services'

import '~/style/gameStatusIndicator.scss'

const GameStatusIndicator: React.FC<{}> = observer(() => {

  const game = useChess()

  return game.gameStatus.victor ? (
    <div className={`game-status-indicator ${game.gameStatus.state}`}>
      {game.gameStatus.victor === 'none' ? (<>
        <span className='status'>
          <span className='main-status'>It's a draw!</span>
          <span className='substatus'>{game.gameStatus.state === 'stalemate' ? ' (stalemate)' : ' (agreement)'}</span>
        </span> 
        <span className='symbols'>
          <span className='swatch small white'/>{' = '}<span className='swatch small black'/>
          {game.gameStatus.state === 'stalemate' ? ', $' : ''}
        </span> 
      </>) : (<>
        <span className='victor'>
          <span className='main-status'><span className={`swatch ${game.gameStatus.victor}`}/>won!</span>
          <span className='substatus'>{game.gameStatus.state === 'checkmate' ? ' (checkmate)' : ' (concession)'}</span>
        </span>
        <span className='symbols'>{game.gameStatus.victor === 'white' ? '1-0' : '0-1'}{game.gameStatus.state === 'checkmate' ? ', #' : ', con.'}</span> 
      </>)}
    </div>
  ) : null
})

export default GameStatusIndicator
