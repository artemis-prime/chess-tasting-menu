import { useContext } from 'react'

import MovePairs from './MovePairs'
import { UIServicesContext, type UIServices } from './UIServicesProvider'
import {type GetMoveNoteFn} from '~/app/widgets/movesTable/getMoveNote'

const useMovePairs = (f: GetMoveNoteFn): MovePairs =>  {
  const result = (useContext(UIServicesContext) as UIServices).movePairs
  result.setMoveNoteFn(f)
  return result
}
export default useMovePairs
