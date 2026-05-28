import React, { useEffect, type PropsWithChildren } from 'react'

import type { Game } from '@artemis-prime/chess-core'
import { getGameSingleton } from '@artemis-prime/chess-core'

const DomainContext = React.createContext<Game | undefined>(undefined) 

const DomainProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  useEffect(() => {
    const disposers = getGameSingleton().registerReactions()
    return () => { disposers.forEach((disposers) => {disposers()}) }
  }, [])
  
  return (
    <DomainContext.Provider value={getGameSingleton()}>
      {children}
    </DomainContext.Provider>
  )
}

export {
  DomainProvider as default,
  DomainContext
}
 