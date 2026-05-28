import { useContext } from 'react'

import type { Game } from '@artemis-prime/chess-core'
import { DomainContext } from './DomainProvider'

const useChess = (): Game =>  {
  return useContext(DomainContext) as Game
}

export default useChess
