import React, { type PropsWithChildren } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider, theme } from '~/style/stitches.config'

import DomainProvider from '~/services/DomainProvider'
import UIServicesProvider from '~/services/UIServicesProvider'

    // On Android, need a single GestureHandlerRootView
    // at the root of all gesture use.
    // https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/events
const Services: React.FC<PropsWithChildren> = ({
  children
}) => (
  <ThemeProvider theme={theme}>
    <DomainProvider >
      <UIServicesProvider>
        <GestureHandlerRootView >
          {children}
        </GestureHandlerRootView >
      </UIServicesProvider>
    </DomainProvider>
  </ThemeProvider>
)

export default Services
