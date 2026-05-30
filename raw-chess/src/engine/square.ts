import { makeObservable, observable, action } from 'mobx'

import type ObsSquare from '../model/observable/obs-square'

import type Piece from '../model/piece'
import type Position from '../model/position'
import type { File, Rank } from '../model/position'
import type SquareState from '../model/square-state'

class Square implements ObsSquare {

  readonly rank: Rank
  readonly file: File
  occupant: Piece | null 
  state: SquareState

  constructor(
    rank: Rank, 
    file: File, 
    occupant: Piece | null, 
    squareState: SquareState, 
    observeState?: boolean
  ) {
    this.rank = rank
    this.file = file
    this.occupant = occupant
    this.state = squareState
    
    if (observeState) {
      makeObservable(this, { 
        occupant: observable,
        state: observable,
        setOccupant: action,
        setSquareState: action
      })
    }
  }

  setOccupant(p: Piece | null): void {
    this.occupant = p
  }

  setSquareState(s: SquareState): void {
    this.state = s 
  }

  get piece(): Piece | null {
    return this.occupant
  }

  get squareState(): SquareState {
    return this.state
  }

  clone(): Square {
    return new Square(
      this.rank,
      this.file,
      this.occupant ? {...this.occupant} : null,
      this.state
    )
  }
}

export default Square
