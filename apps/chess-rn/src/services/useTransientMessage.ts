import { useContext } from 'react'

import type TransientMessage from './TransientMessage'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useTransientMessage = (): TransientMessage =>  {
  return (useContext(UIServicesContext) as UIServices).transientMessage 
}

export default useTransientMessage
