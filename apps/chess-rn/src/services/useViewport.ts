import { useContext } from 'react'

import type ViewportState from './ViewportState'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useViewport = (): ViewportState =>  {
  return (useContext(UIServicesContext) as UIServices).viewport
}
export default useViewport
