import { useContext } from 'react'

import type ChessboardOrientation from './ChessboardOrientation'
import { UIServicesContext } from './UIServicesProvider'

const useChessboardOrientation = (): ChessboardOrientation =>  {
  return useContext(UIServicesContext)?.chessboardOrientation as ChessboardOrientation
}

export default useChessboardOrientation
