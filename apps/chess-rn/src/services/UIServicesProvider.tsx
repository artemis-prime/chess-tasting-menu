import React, {
  type PropsWithChildren,
  useEffect,
  useRef
} from 'react'

import useChess from './useChess'
import { ChessboardOrientationImpl } from './ChessboardOrientation'
import { PulsesImpl } from './Pulses'
import { TransientMessageImpl } from './TransientMessage'
import { MenuStateImpl } from './MenuState'
import { ChalkboardStateImpl } from './ChalkboardState'
import { ViewportStateImpl } from './ViewportState'
import MovePairs from './MovePairs'

interface UIServices  {
  pulses: PulsesImpl
  menu: MenuStateImpl
  chessboardOrientation: ChessboardOrientationImpl
  chalkboard: ChalkboardStateImpl
  transientMessage: TransientMessageImpl
  viewport: ViewportStateImpl
  movePairs: MovePairs
}

const UIServicesContext = React.createContext<UIServices | undefined>(undefined) 

const UIServicesProvider: React.FC< PropsWithChildren<{}>> = ({ children }) => {

  const game = useChess()

  const servicesRef = useRef<UIServices>({
    pulses: new PulsesImpl(),
    menu: new MenuStateImpl(),
    chessboardOrientation: new ChessboardOrientationImpl(game),
    transientMessage: new TransientMessageImpl(game),
    chalkboard: new ChalkboardStateImpl(),
    viewport: new ViewportStateImpl(),
    movePairs: new MovePairs(game),
  })

  useEffect(() => {
    const s = servicesRef.current;
    game.registerListener(s.transientMessage, 'chess-web-messages-store');
    s.chessboardOrientation.initialize()
    s.pulses.initialize()
    s.transientMessage.initialize()
    s.viewport.initialize()
    s.movePairs.initialize()

    return () => {
      game.unregisterListener('chess-web-messages-store')
      s.chessboardOrientation.dispose()
      s.pulses.dispose()
      s.transientMessage.dispose()
      s.viewport.dispose()
      s.movePairs.dispose()
    }
  }, [])

  return (
    <UIServicesContext.Provider value={servicesRef.current}>
      {children}
    </UIServicesContext.Provider>
  )
}

export {
  UIServicesProvider as default,
  UIServicesContext,
  type UIServices
}
