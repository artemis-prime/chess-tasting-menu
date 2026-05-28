import { computedFn } from 'mobx-utils'
import { type Side } from '@artemis-prime/chess-core'

import { type CSS } from '~/style'
import { type Pulses, MovePairs, type MovePair } from '~/services'

class Helper {

  private _state: MovePairs 
  private _pulses: Pulses

  constructor(r: MovePairs, p: Pulses) {
    this._state = r
    this._pulses = p
  }

  pulsingOpacity = computedFn((enabled: boolean): CSS => (
    (enabled) ? { opacity: this._pulses.slow ? .8 : .7} : {}
  )) 

  pulsingFontSize = computedFn((on: string, off: string, enabled: boolean): CSS => (
    (enabled) ? { fontSize: this._pulses.slow ? on : off} : {}
  )) 

  sideHilight = computedFn((moveRow: number, side: Side): CSS => {

    if (this._state.hilightedMoveRow !== null) {
      if (this._state.hilightedMoveRow === moveRow && this._state.hilightedSide === side) {
        return {
          p: '0.15em',
          border: '0.1em dashed $alert8',
          borderRadius: '3px'
        }
      }
    }
    return {p: '0.25em'}
  })

  sideTextProps = computedFn((r: MovePair, index: number, side: Side): { alert?: boolean, disabled?: boolean} => {

    if (this.disableSide(index, side)) {
      return { disabled: true }
    }
    const half = r[side]
    return { alert: (!!half && (!!half.rec.annotatedResult || half.rec.action.includes('capture'))) }
  })

  disableSide = computedFn((moveRow: number, side: Side): boolean => {

    if (this._state.hilightedMoveRow !== null) {
      if (moveRow > this._state.hilightedMoveRow) {
        return true
      }
      else if (moveRow === this._state.hilightedMoveRow) {
        if (side === 'black' && this._state.hilightedSide === 'white') {
          return true 
        }
      }
    }
    return false
  })

  disableRow = computedFn((moveRow: number): boolean => {

    if (this._state.hilightedMoveRow !== null) {
      if (moveRow > this._state.hilightedMoveRow) {
        return true
      }
    }
    return false
  })

  sizingString = computedFn((): string => {
    if (this._state.rows.length < 10) {
      return '7)'
    } 
    else if (this._state.rows.length < 100) {
      return '77)'
    }
    else {
      return '777)'
    }
  })

}

export default Helper
