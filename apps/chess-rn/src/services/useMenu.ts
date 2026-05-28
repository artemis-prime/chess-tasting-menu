import { useContext } from 'react'

import type MenuState from './MenuState'
import { UIServicesContext, type UIServices } from './UIServicesProvider'

const useMenu = (): MenuState =>  {
  return (useContext(UIServicesContext) as UIServices).menu
}
export default useMenu
