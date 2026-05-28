import { useContext } from 'react'

import type ChessboardOrientation from './ChessboardOrientation'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useChessboardOrientation = (): ChessboardOrientation =>  {
  return (useContext(UIServicesContext) as UIServices).chessboardOrientation 
}

export default useChessboardOrientation
