import { useContext } from 'react'

import type Pulses from './Pulses'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const usePulses = (): Pulses =>  {
  return (useContext(UIServicesContext) as UIServices).pulses
}
export default usePulses
