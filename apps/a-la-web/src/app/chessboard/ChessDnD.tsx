import React, { 
  useContext, 
  useEffect, 
  useRef 
} from 'react'

import { 
  DndContext, 
  type DragStartEvent,
  type DragEndEvent,
  type DragCancelEvent,
  type DragMoveEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,

} from '@dnd-kit/core'

import { positionsEqual, type ObsPieceRef } from '@artemis-prime/chess-core'

import { useChess } from '~/services'

import {type DnDStateInternal, getDnDStateSingleton} from './DnDState' 
import type DnDPayload from './DnDPayload'

const ChessDnDContext = React.createContext<DnDStateInternal | undefined>(undefined) 

const useDraggingPiece = (): ObsPieceRef => (
  useContext(ChessDnDContext) as ObsPieceRef
)

const ChessDnDShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const dragStateRef = useRef<DnDStateInternal>(getDnDStateSingleton())
  const sensorsSpreadRef = useRef<any>({})
  const game = useChess()

  const pointerSensor = useSensor(PointerSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(
    pointerSensor,
    touchSensor,
    keyboardSensor
  )

  useEffect(() => {
    const isTouchEnabled = () => (
      ( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 )
    )
      // either default (pointer + keyboard), 
      // or pointer + keyboard + touch
    if (isTouchEnabled()) {
      sensorsSpreadRef.current = {sensors}
    } 
  }, [])

  const onDragStart = (event: DragStartEvent) => {
    dragStateRef.current.setPayload(event.active.data.current as DnDPayload)
    //console.log('drag started: ' + event.active.data.current?.piece.type)
  }

  const onDragEnd = (event: DragEndEvent) => {
    const taken = game.takeResolvedAction()
    dragStateRef.current.clear()
    //console.log(`drag ended: ${!taken ? 'NO ' : ''}action taken`)
  }

  const onDragUpdate = (event: DragMoveEvent) => {

    const pos = (event.over && event.over.data.current) ? event.over.data.current.position : null
    if (pos && dragStateRef.current.piece) {
      if (!positionsEqual(pos, dragStateRef.current.squareOver!)) {
        game.resolveAction({
          piece: dragStateRef.current.piece, 
          from: dragStateRef.current.from!, // will be set if piece is
          to: pos
        })
        dragStateRef.current.setSquareOver(pos)
      }
    }
  }

  const onDragCancel = (event: DragCancelEvent) => {
    game.abandonResolution()
    dragStateRef.current.clear()
    //console.log('drag cancelled, NO action taken')
  }

  return (
    <ChessDnDContext.Provider value={dragStateRef.current}>
    <DndContext
      {...sensorsSpreadRef.current}
      onDragStart={onDragStart}
      onDragMove={onDragUpdate}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}
    </DndContext>
    </ChessDnDContext.Provider>
  )
}

export {
  ChessDnDShell,
  useDraggingPiece,
}