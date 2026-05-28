import React, { 
  useContext, 
  useRef 
} from 'react'
import { type LayoutChangeEvent } from 'react-native'

import {
  Gesture,
  GestureDetector,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'

import { 
  type Position, 
  RANKS,
  FILES,
  positionsEqual, 
  positionToString,
  layoutPositionToBoardPosition, 
} from '@artemis-prime/chess-core'

import { useChess } from '~/services'

import type Point from './Point'
import {
  type DragState,
  type DnDStateInternal, 
  getDnDStateSingleton
} from './DnDState' 

interface ChessDnDConfig {
  layoutListener:(e: LayoutChangeEvent) => void
  setWhiteOnBottom: (b: boolean) => void 
}

  // Just a way of avoiding to Contexts, Providers, etc
interface DnDDuo {
  config: ChessDnDConfig
  state: DragState
}

const ChessDnDContext = React.createContext<DnDDuo | undefined>(undefined) 

const useDnDConfig = (): ChessDnDConfig => (
  (useContext(ChessDnDContext) as DnDDuo).config 
)

const useDragState = (): DragState => (
  (useContext(ChessDnDContext) as DnDDuo).state 
)

const ChessDnDShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const dimensionsRef = useRef<Point | null>(null)
  const stateRef = useRef<DnDStateInternal>(getDnDStateSingleton())

  const whiteOnBottomRef = useRef<boolean>(true)
  const setWhiteOnBottom = (b: boolean): void => { 
    whiteOnBottomRef.current = b 
  }
  const game = useChess()

  const squareFromTouchOffset = (pt: Point): Position | null => {

    if (!dimensionsRef.current 
      || 
      (pt.x < 0 && pt.x > dimensionsRef.current.x) 
      || 
      (pt.y < 0 && pt.y > dimensionsRef.current.y)
    ) {
      return null
    }

    const columnWidth = dimensionsRef.current.x / FILES.length
    const rowHeight = dimensionsRef.current.y / RANKS.length
    const column = Math.floor(pt.x / columnWidth) 
    const row = Math.floor(pt.y / rowHeight)
    return layoutPositionToBoardPosition(row, column, !(whiteOnBottomRef.current))
  }

  const layoutListener = (
    {nativeEvent: { layout: { width, height }}}: LayoutChangeEvent
  ): void  => {
    dimensionsRef.current = { x: width, y: height }
  }

  const onDragStart = (e: PanGestureHandlerEventPayload) => {

    const { x, y } = e
    const p = squareFromTouchOffset({x, y})
    if (!p) {
      return 
    }

    const piece = game.getOccupant(p)
    if (piece) {
      if (game.currentTurn === piece.side) {
        stateRef.current.setPiece(piece)
        stateRef.current.setFrom(p)
      }
    }
  }

  const onDragUpdate = (e: PanGestureHandlerEventPayload) => {
    if (stateRef.current.piece) {
      const { x, y } = e 
      const pos = squareFromTouchOffset({x, y})
      stateRef.current.setOffset({x, y}) // needed for dragging piece component 
      if (pos) {
        if (!positionsEqual(pos, stateRef.current.squareOver!)) {
          game.resolveAction({
            piece: stateRef.current.piece, 
            from: stateRef.current.from!,  // from is there if piece is
            to: pos
          })
          stateRef.current.setSquareOver(pos)
        }
      }
    }
  }

  const onDragEnd = (e: PanGestureHandlerEventPayload, succeeded: boolean) => {

    if (succeeded) {
      game.takeResolvedAction()
    }
    else {
      game.abandonResolution()
    }
    stateRef.current.clear()
  }

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(onDragStart)
    .onUpdate(onDragUpdate)
    .onEnd(onDragEnd);

  return (
    <ChessDnDContext.Provider value={{
      state: stateRef.current, 
      config: {
        layoutListener,
        setWhiteOnBottom
      }}}
    >
      <GestureDetector gesture={dragGesture}>
        {children}
      </GestureDetector>
    </ChessDnDContext.Provider>
  )
}

export {
  ChessDnDShell,
  useDragState,
  useDnDConfig,
}