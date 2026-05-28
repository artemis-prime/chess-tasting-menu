import { makeObservable, observable, action } from 'mobx'

import type ObsSquare from '../ObsSquare'

import type Piece from '../Piece'
import type Position from '../Position'
import type { File, Rank } from '../Position'
import type SquareState from '../SquareState'

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
