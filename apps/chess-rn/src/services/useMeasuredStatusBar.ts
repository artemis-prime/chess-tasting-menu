import { useCallback, useContext, useEffect, useRef } from 'react'
import { StatusBar, type LayoutChangeEvent } from 'react-native'
import { reaction } from 'mobx'

import { UIServicesContext, type UIServices } from '~/services/UIServicesProvider'

/*
  This is a workaround for the known bug of StatusBar.currentHeight not working
  when orientation changes.  By observation, it is current when the app launches
  (in whichever orientation), but does not change when orientation changes.
  This hook measures the StatusBar height in a three step process, once for 
  whichever orientation was switched to.  In other words, this logic will be 
  executed only once. If we start in portrait (and get the correct height for it
  from the API), then landscape will be measured when switched to and cached.

  The technique is to turn off the translucent SB, which changes it's status in 
  from a fixed overlay, to a sibling of Main. Therefore if we toggle it, we 
  can measure the difference in the height of Main that results, and use that
  as the height of the status bar from then on.

  Please also note re ViewportState: set() / get(), as well as hasStatusBarHeight()
  are for whichever orientation is currently active. 
*/ 
const useMeasuredStatusBar = (): ((event: LayoutChangeEvent) => void) => {

  const viewport =  (useContext(UIServicesContext) as UIServices).viewport
  const heightRef = useRef<number>(-1)
  const stepRef = useRef<'complete' | 'initialChange' | 'secondChange'>('complete')

  const onLayout = useCallback((event: LayoutChangeEvent) => {

    if (stepRef.current === 'initialChange') {
      const { height } = event.nativeEvent.layout
      heightRef.current = height  
      StatusBar.setTranslucent(true)  
      stepRef.current = 'secondChange'
    }
    else if (stepRef.current === 'secondChange') {
      const { height } = event.nativeEvent.layout
      const sbHeight = Math.abs(heightRef.current - height)
      viewport.setStatusBarHeight(sbHeight)
      heightRef.current = -1
      stepRef.current = 'complete'
    }
  }, [])

  useEffect(() => {
    return reaction(
      () => (viewport.landscape),
      (l: boolean) => {
        if (!viewport.hasStatusBarHeight) {
          stepRef.current = 'initialChange'
          StatusBar.setTranslucent(false)  
        }
      }
    )
  })

  return onLayout
}

export default useMeasuredStatusBar
