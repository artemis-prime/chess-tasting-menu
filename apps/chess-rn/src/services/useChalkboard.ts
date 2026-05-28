import { useContext } from 'react'

import type ChalkboardState from './ChalkboardState'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useChalkboard = (): ChalkboardState =>  {
  return (useContext(UIServicesContext) as UIServices).chalkboard
}
export default useChalkboard
